from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder

from app import crud, models, schemas
from app.api import deps
from app.db.session import get_db
from app.services import openai_service

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
        result = openai_service.validate_api_key(key_data.api_key)
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
    config = crud.openai.get_by_user_id(db, user_id=current_user.id)
    if not config:
        # Return an empty list instead of a 404 error
        return {"models": []}
    
    try:
        # Decrypt the API key
        api_key = crud.openai.get_decrypted_api_key(config)
        models = openai_service.get_available_models(api_key)
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
    existing_config = crud.openai.get_by_user_id(db, user_id=current_user.id)
    if existing_config:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OpenAI configuration already exists for this user"
        )
    
    # Validate API key
    try:
        is_valid = openai_service.validate_api_key(config_in.api_key)
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
    config = crud.openai.create(db, obj_in=config_in, user_id=current_user.id)
    return config


@router.get("/config", response_model=schemas.OpenAIConfig)
def read_openai_config(
    *,
    db=Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get the OpenAI configuration for the current user.
    """
    config = crud.openai.get_by_user_id(db, user_id=current_user.id)
    if not config:
        # Instead of returning a 404 error, return an empty configuration object
        # This will be interpreted by the frontend as 'no configuration exists yet'
        return {
            "id": None,
            "user_id": current_user.id,
            "selected_model": None,
            "encrypted_api_key": None
        }
    return config


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
    config = crud.openai.get_by_user_id(db, user_id=current_user.id)
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="OpenAI configuration not found"
        )
    
    # If updating API key, validate it
    if config_in.api_key:
        try:
            is_valid = openai_service.validate_api_key(config_in.api_key)
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
    
    config = crud.openai.update(db, db_obj=config, obj_in=config_in)
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
    config = crud.openai.get_by_user_id(db, user_id=current_user.id)
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="OpenAI configuration not found"
        )
    config = crud.openai.remove(db, id=config.id)
    return config
