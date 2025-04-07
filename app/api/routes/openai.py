from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException, status, Request, Form
from fastapi.encoders import jsonable_encoder
from fastapi.responses import RedirectResponse

from app import crud, models, schemas
from app.api import deps
from app.db.session import get_db
from app.services.openai_service import OpenAIService

router = APIRouter(prefix="/openai")


@router.post("/validate-key", response_model=schemas.OpenAIKeyValidation)
def validate_api_key(
    *,
    key_data: schemas.OpenAIApiKey,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Validate an OpenAI API key.
    """
    try:
        result = OpenAIService.validate_api_key_static(key_data.api_key)
        return {"valid": result}
    except Exception as e:
        return {"valid": False, "error": str(e)}


@router.get("/models", response_model=schemas.ModelList)
def get_available_models(
    current_user: models.User = Depends(deps.get_current_user),
    db=Depends(get_db),
) -> Any:
    """
    Get a list of available OpenAI models.
    Uses the user's API key from their configuration.
    """
    # Get the user's OpenAI config
    config = crud.openai_config.get_by_user_id(db, user_id=current_user.id)
    if not config:
        # Return an empty list instead of a 404 error
        return {"models": []}
    
    try:
        # Get the API key (no longer encrypted)
        api_key = crud.openai_config.get_api_key(config)
        models = OpenAIService.get_available_models(api_key)
        return {"models": models}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching models: {str(e)}"
        )


@router.post("/config", response_model=schemas.OpenAIConfig)
def create_openai_config(
    *,
    db=Depends(get_db),
    config_in: schemas.OpenAIConfigCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new OpenAI configuration for a user.
    """
    # Check if config already exists for this user
    existing_config = crud.openai_config.get_by_user_id(db, user_id=current_user.id)
    if existing_config:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OpenAI configuration already exists for this user"
        )
    
    # Validate API key
    try:
        is_valid = OpenAIService.validate_api_key_static(config_in.api_key)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid OpenAI API key"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error validating API key: {str(e)}"
        )
    
    # Create config with user ID
    config_in_data = jsonable_encoder(config_in)
    config = crud.openai_config.create(db, obj_in=config_in, user_id=current_user.id)
    return config


@router.get("/config", response_model=schemas.OpenAIConfigStatus)
def read_openai_config(
    *,
    db=Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get the OpenAI configuration for the current user.
    Returns a status object indicating if a configuration exists.
    """
    config = crud.openai_config.get_by_user_id(db, user_id=current_user.id)
    if not config:
        # Return a status object indicating no configuration exists
        return {
            "exists": False,
            "config": None
        }
    
    # Return a status object indicating configuration exists
    return {
        "exists": True,
        "config": config
    }


@router.put("/config", response_model=schemas.OpenAIConfig)
def update_openai_config(
    *,
    db=Depends(get_db),
    config_in: schemas.OpenAIConfigUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Update the OpenAI configuration for the current user.
    """
    config = crud.openai_config.get_by_user_id(db, user_id=current_user.id)
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="OpenAI configuration not found"
        )
    
    # If updating API key, validate it
    if config_in.api_key:
        try:
            is_valid = OpenAIService.validate_api_key_static(config_in.api_key)
            if not is_valid:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid OpenAI API key"
                )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Error validating API key: {str(e)}"
            )
    
    config = crud.openai_config.update(db, db_obj=config, obj_in=config_in)
    return config


@router.delete("/config", response_model=schemas.OpenAIConfig)
def delete_openai_config(
    *,
    db=Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete the OpenAI configuration for the current user.
    """
    config = crud.openai_config.get_by_user_id(db, user_id=current_user.id)
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="OpenAI configuration not found"
        )
    config = crud.openai_config.remove(db, id=config.id)
    return config


@router.post("/config-form")
def handle_config_form(
    request: Request,
    action: str = Form(...),
    api_key: str = Form(None),
    model: str = Form(None),
    db=Depends(get_db)
) -> Any:
    """
    Handle the OpenAI configuration form submission.
    This endpoint processes the HTML form for OpenAI configuration.
    """
    # Get user from cookie
    current_user = deps.get_current_user_from_cookie(request, db)
    if not current_user:
        return RedirectResponse(
            url="/openai-config?error=Authentication required. Please log in.",
            status_code=status.HTTP_303_SEE_OTHER
        )
    # Get existing config if any
    config = crud.openai_config.get_by_user_id(db, user_id=current_user.id)
    
    # Handle API key validation
    if action == "validate":
        # If API key is empty, use existing key
        if not api_key:
            if not config or not config.api_key:
                return RedirectResponse(
                    url="/openai-config?error=No API key provided",
                    status_code=status.HTTP_303_SEE_OTHER
                )
            api_key = config.api_key
        # If API key is unchanged, use existing key
        elif config and api_key == config.api_key:
            # User didn't change the key, just use the existing one
            pass
        
        # Validate the API key
        try:
            is_valid = OpenAIService.validate_api_key_static(api_key)
            if not is_valid:
                return RedirectResponse(
                    url="/openai-config?error=Invalid API key",
                    status_code=status.HTTP_303_SEE_OTHER
                )
            
            # Create or update config with the validated key
            if config:
                config = crud.openai_config.update(
                    db, 
                    db_obj=config, 
                    obj_in=schemas.OpenAIConfigUpdate(api_key=api_key)
                )
            else:
                config = crud.openai_config.create(
                    db, 
                    obj_in=schemas.OpenAIConfigCreate(api_key=api_key),
                    user_id=current_user.id
                )
            
            return RedirectResponse(
                url="/openai-config?success=true",
                status_code=status.HTTP_303_SEE_OTHER
            )
        except Exception as e:
            return RedirectResponse(
                url=f"/openai-config?error={str(e)}",
                status_code=status.HTTP_303_SEE_OTHER
            )
    
    # Handle save configuration
    elif action == "save":
        if not config:
            return RedirectResponse(
                url="/openai-config?error=No configuration exists. Please validate an API key first.",
                status_code=status.HTTP_303_SEE_OTHER
            )
        
        # Update the selected model
        if model:
            config = crud.openai_config.update(
                db, 
                db_obj=config, 
                obj_in=schemas.OpenAIConfigUpdate(selected_model=model)
            )
            return RedirectResponse(
                url="/openai-config?saved=true",
                status_code=status.HTTP_303_SEE_OTHER
            )
        else:
            return RedirectResponse(
                url="/openai-config?error=No model selected",
                status_code=status.HTTP_303_SEE_OTHER
            )
    
    # Handle reset configuration
    elif action == "reset":
        if not config:
            return RedirectResponse(
                url="/openai-config?error=No configuration exists to reset.",
                status_code=status.HTTP_303_SEE_OTHER
            )
        
        # Reset the configuration by clearing the API key and selected model
        config = crud.openai_config.update(
            db, 
            db_obj=config, 
            obj_in=schemas.OpenAIConfigUpdate(api_key="", selected_model="")
        )
        
        return RedirectResponse(
            url="/openai-config?success=Configuration has been reset successfully.",
            status_code=status.HTTP_303_SEE_OTHER
        )
    
    # Invalid action
    return RedirectResponse(
        url="/openai-config?error=Invalid action",
        status_code=status.HTTP_303_SEE_OTHER
    )
