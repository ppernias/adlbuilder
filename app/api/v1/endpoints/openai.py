from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, Body, Form, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
import urllib.parse
from openai import OpenAI

from app import crud, models, schemas
from app.api import deps
from app.services.openai_service import OpenAIService

router = APIRouter()


@router.post("/config", response_model=schemas.OpenAIConfig)
def create_openai_config(
    *,
    db: Session = Depends(deps.get_db),
    openai_in: schemas.OpenAIConfigCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Create OpenAI configuration"""
    # Check if config already exists for user
    existing_config = crud.openai_config.get_by_user_id(db, user_id=current_user.id)
    if existing_config:
        raise HTTPException(
            status_code=400,
            detail="OpenAI configuration already exists for this user",
        )
    
    # Validate API key
    is_valid = OpenAIService.validate_api_key_static(openai_in.api_key)
    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail="Invalid OpenAI API key",
        )
    
    return crud.openai_config.create(db, obj_in=openai_in, user_id=current_user.id)


@router.put("/config", response_model=schemas.OpenAIConfig)
def update_openai_config(
    *,
    db: Session = Depends(deps.get_db),
    openai_in: schemas.OpenAIConfigUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Update OpenAI configuration"""
    # Get existing config
    config = crud.openai_config.get_by_user_id(db, user_id=current_user.id)
    if not config:
        raise HTTPException(
            status_code=404,
            detail="OpenAI configuration not found",
        )
    
    # Validate API key if provided
    if openai_in.api_key:
        is_valid = OpenAIService.validate_api_key_static(openai_in.api_key)
        if not is_valid:
            raise HTTPException(
                status_code=400,
                detail="Invalid OpenAI API key",
            )
    
    return crud.openai_config.update(db, db_obj=config, obj_in=openai_in)


@router.get("/config", response_model=schemas.OpenAIConfig)
def get_openai_config(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Get OpenAI configuration"""
    config = crud.openai_config.get_by_user_id(db, user_id=current_user.id)
    if not config:
        raise HTTPException(
            status_code=404,
            detail="OpenAI configuration not found",
        )
    return config


@router.get("/models", response_model=schemas.OpenAIModelsResponse)
def get_openai_models(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Get available OpenAI models"""
    # Get API key
    config = crud.openai_config.get_by_user_id(db, user_id=current_user.id)
    if not config:
        raise HTTPException(
            status_code=404,
            detail="OpenAI configuration not found",
        )
    
    # Get API key (no longer encrypted)
    api_key = config.api_key
    
    # Get models
    models = OpenAIService.get_available_models(api_key)
    return {"models": models}


@router.get("/config-data", response_model=schemas.OpenAIConfigData)
def get_openai_config_data(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Get complete OpenAI configuration data including models"""
    # Get user's config
    config = crud.openai_config.get_by_user_id(db, user_id=current_user.id)
    
    result = {
        "exists": False,
        "config": None,
        "models": []
    }
    
    if config:
        result["exists"] = True
        # Asegurarse de que la clave API se envía correctamente
        result["config"] = {
            "id": config.id,
            "api_key": config.api_key,
            "selected_model": config.selected_model,
            "user_id": config.user_id,
            "created_at": config.created_at,
            "updated_at": config.updated_at
        }
        
        # Get models if we have an API key
        if config.api_key:
            try:
                models = OpenAIService.get_available_models(config.api_key)
                result["models"] = models
            except Exception as e:
                print(f"Error getting models: {str(e)}")
    
    return result


@router.post("/config-form")
def process_openai_config_form(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
    api_key: str = Form(None),
    model: str = Form(None),
    action: str = Form("validate"),
    request: Request,
) -> Any:
    """
    Process the OpenAI configuration form submission.
    Handles both validation and saving actions.
    """
    # Check if user already has a configuration
    existing_config = crud.openai_config.get_by_user_id(db, user_id=current_user.id)
    
    # Handle validation action
    if action == "validate" and api_key:
        # Validate the API key first
        try:
            # Skip validation if the key is masked (user didn't change it)
            if existing_config and "•••" in api_key:
                # Use existing key instead
                api_key = existing_config.api_key
            
            # Validate with OpenAI
            is_valid = OpenAIService.validate_api_key_static(api_key)
            
            if is_valid:
                # Save the key if it's new or different
                if not existing_config:
                    config_in = schemas.OpenAIConfigCreate(api_key=api_key)
                    crud.openai_config.create_with_user(db=db, obj_in=config_in, user_id=current_user.id)
                elif existing_config.api_key != api_key:
                    crud.openai_config.update(db=db, db_obj=existing_config, obj_in={"api_key": api_key})
                
                # Redirect back to the config page with success message
                return RedirectResponse(url="/openai-config?success=true", status_code=302)
            else:
                # Invalid API key
                return RedirectResponse(
                    url="/openai-config?error=" + urllib.parse.quote("Invalid API key"),
                    status_code=302
                )
                
        except Exception as e:
            # Error during validation
            return RedirectResponse(
                url="/openai-config?error=" + urllib.parse.quote(str(e)),
                status_code=302
            )
    
    # Handle save action
    elif action == "save" and model:
        try:
            if existing_config:
                # Update existing config
                update_data = {"selected_model": model}
                if api_key:
                    # Only update API key if it's not masked (user changed it)
                    if not "•••" in api_key:
                        update_data["api_key"] = api_key
                
                config = crud.openai_config.update(db=db, db_obj=existing_config, obj_in=update_data)
            else:
                # Create new config
                config_in = schemas.OpenAIConfigCreate(api_key=api_key, selected_model=model)
                config = crud.openai_config.create_with_user(db=db, obj_in=config_in, user_id=current_user.id)
            
            # Redirect back to the config page with success message
            return RedirectResponse(url="/openai-config?saved=true", status_code=302)
        except Exception as e:
            # Error during save
            return RedirectResponse(
                url="/openai-config?error=" + urllib.parse.quote(str(e)),
                status_code=302
            )
    
    # If we get here, something went wrong
    return RedirectResponse(url="/openai-config?error=Invalid request", status_code=302)


@router.post("/validate-key")
def validate_openai_key(
    *,
    api_key: str = Body(..., embed=True),
) -> Any:
    """Validate OpenAI API key"""
    print(f"Received API key for validation: {api_key[:5]}...")  # Log first 5 chars
    
    # Check if API key is in the correct format (starts with 'sk-')
    if not api_key.startswith('sk-'):
        return {"valid": False, "error": "API key must start with 'sk-'."}
    
    # Try to validate with OpenAI API
    try:
        # Use the static method for validation
        is_valid = OpenAIService.validate_api_key_static(api_key)
        
        if is_valid:
            return {"valid": True}
        else:
            return {"valid": False, "error": "Could not validate API key with OpenAI. Please check your key and try again."}
    except Exception as e:
        print(f"Exception during API key validation: {str(e)}")
        return {"valid": False, "error": f"Error validating API key: {str(e)}"}
