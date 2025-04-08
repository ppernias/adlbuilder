from typing import Any, List, Optional
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, Body, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
import tempfile

from app import crud, models, schemas
from app.api import deps
from app.services.yaml_service import YAMLService
from app.services.openai_service import OpenAIService
# Removed decrypt_api_key import

router = APIRouter()


@router.get("/", response_model=List[schemas.Assistant])
def get_assistants(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Retrieve assistants"""
    assistants = crud.assistant.get_multi_by_user(
        db, user_id=current_user.id, skip=skip, limit=limit
    )
    return assistants


@router.post("/", response_model=schemas.Assistant)
def create_assistant(
    *,
    db: Session = Depends(deps.get_db),
    assistant_in: schemas.AssistantCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Create new assistant"""
    assistant = crud.assistant.create(db, obj_in=assistant_in, user_id=current_user.id)
    return assistant


@router.get("/default", response_model=schemas.AssistantCreate)
def create_default_assistant(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Create a default assistant based on schema"""
    # Read schema file
    try:
        schema_path = Path("/root/adlbuilder/schema.yaml")
        if not schema_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Schema file not found",
            )
            
        with open(schema_path, "r") as f:
            schema_content = f.read()
        
        # Create default assistant
        _, yaml_content = YAMLService.create_default_assistant(schema_content)
        
        return {
            "name": "New Assistant",
            "description": "Default assistant based on schema",
            "yaml_content": yaml_content
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error creating default assistant: {str(e)}",
        )


@router.get("/schema")
def get_schema() -> Any:
    """Get the schema content"""
    try:
        schema_path = Path("/root/adlbuilder/schema.yaml")
        if not schema_path.exists():
            raise HTTPException(
                status_code=404,
                detail="Schema file not found",
            )
            
        with open(schema_path, "r") as f:
            schema_content = f.read()
        
        return {"schema": schema_content}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading schema: {str(e)}",
        )


@router.post("/validate")
def validate_yaml(
    *,
    yaml_content: str = Body(..., embed=True),
) -> Any:
    """Validate YAML content against schema"""
    try:
        import logging
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.DEBUG)
        
        logger.debug("Validating YAML content...")
        logger.debug(f"Content length: {len(yaml_content)}")
        
        # Log primeras líneas del contenido para depuración
        content_preview = '\n'.join(yaml_content.split('\n')[:10])  # Primeras 10 líneas
        logger.debug(f"Content preview:\n{content_preview}...")
        
        # Validar que el contenido sea YAML válido antes de validar contra el esquema
        try:
            import yaml
            parsed_yaml = yaml.safe_load(yaml_content)
            if not parsed_yaml:
                logger.error("Content is not valid YAML or is empty")
                return {
                    "valid": False,
                    "errors": ["The content does not contain valid YAML or is empty."]
                }
            logger.debug("Content is valid YAML")
            
            # Imprimir la estructura del YAML para depuración
            import json
            logger.debug(f"YAML structure: {json.dumps(parsed_yaml, indent=2)}")
        except Exception as yaml_error:
            logger.error(f"Error parsing YAML: {yaml_error}")
            return {
                "valid": False,
                "errors": [f"Error parsing YAML: {str(yaml_error)}"]
            }
        
        schema_path = Path("/root/adlbuilder/schema.yaml")
        if not schema_path.exists():
            logger.error(f"Schema file not found: {schema_path}")
            raise HTTPException(
                status_code=404,
                detail="Schema file not found",
            )
            
        with open(schema_path, "r") as f:
            schema_content = f.read()
        
        logger.debug("Schema file loaded successfully")
        
        # Validate content
        logger.debug("Validating against schema...")
        is_valid, errors = YAMLService.validate_yaml_against_schema(
            yaml_content, schema_content
        )
        
        logger.debug(f"Validation result: {is_valid}")
        if errors:
            logger.debug(f"Validation errors: {errors}")
        
        return {"valid": is_valid, "errors": errors}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error validating YAML: {str(e)}",
        )


@router.post("/upload")
def upload_yaml_file(
    *,
    file: UploadFile = File(...),
) -> Any:
    """Upload and validate YAML file"""
    try:
        import logging
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.DEBUG)
        
        # Read file content
        content = file.file.read().decode("utf-8")
        logger.debug(f"Received file: {file.filename}")
        logger.debug(f"Content length: {len(content)}")
        
        # Log primeras líneas del contenido para depuración
        content_preview = '\n'.join(content.split('\n')[:10])  # Primeras 10 líneas
        logger.debug(f"Content preview:\n{content_preview}...")
        
        # Read schema file
        schema_path = Path("/root/adlbuilder/schema.yaml")
        if not schema_path.exists():
            logger.error(f"Schema file not found: {schema_path}")
            raise HTTPException(
                status_code=404,
                detail="Schema file not found",
            )
            
        with open(schema_path, "r") as f:
            schema_content = f.read()
        
        logger.debug("Schema file loaded successfully")
        
        # Validar que el contenido sea YAML válido antes de validar contra el esquema
        try:
            import yaml
            parsed_yaml = yaml.safe_load(content)
            if not parsed_yaml:
                logger.error("Content is not valid YAML or is empty")
                return {
                    "valid": False,
                    "errors": ["The uploaded file does not contain valid YAML content or is empty."],
                    "yaml_content": None
                }
            logger.debug("Content is valid YAML")
        except Exception as yaml_error:
            logger.error(f"Error parsing YAML: {yaml_error}")
            return {
                "valid": False,
                "errors": [f"Error parsing YAML: {str(yaml_error)}"],
                "yaml_content": None
            }
        
        # Validate content against schema
        logger.debug("Validating against schema...")
        is_valid, errors = YAMLService.validate_yaml_against_schema(
            content, schema_content
        )
        
        logger.debug(f"Validation result: {is_valid}")
        if errors:
            logger.debug(f"Validation errors: {errors}")
        
        if not is_valid:
            return {
                "valid": False,
                "errors": errors,
                "yaml_content": None
            }
        
        # If valid, return the content
        return {
            "valid": True,
            "errors": None,
            "yaml_content": content
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing uploaded file: {str(e)}",
        )
    finally:
        file.file.close()


@router.get("/{assistant_id}", response_model=schemas.Assistant)
def get_assistant(
    *,
    db: Session = Depends(deps.get_db),
    assistant_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Get assistant by ID"""
    assistant = crud.assistant.get(db, id=assistant_id)
    if not assistant:
        raise HTTPException(
            status_code=404,
            detail="Assistant not found",
        )
    if assistant.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions",
        )
    return assistant


@router.put("/{assistant_id}", response_model=schemas.Assistant)
def update_assistant(
    *,
    db: Session = Depends(deps.get_db),
    assistant_id: int,
    assistant_in: schemas.AssistantUpdate,
    is_minor_change: bool = False,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Update assistant"""
    assistant = crud.assistant.get(db, id=assistant_id)
    if not assistant:
        raise HTTPException(
            status_code=404,
            detail="Assistant not found",
        )
    if assistant.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions",
        )
    
    # Update history if needed
    if assistant_in.yaml_content:
        try:
            assistant_in.yaml_content = YAMLService.update_assistant_history(
                assistant_in.yaml_content, is_minor_change
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error updating assistant history: {str(e)}",
            )
    
    assistant = crud.assistant.update(db, db_obj=assistant, obj_in=assistant_in)
    return assistant


@router.delete("/{assistant_id}", response_model=schemas.Assistant)
def delete_assistant(
    *,
    db: Session = Depends(deps.get_db),
    assistant_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Delete assistant"""
    assistant = crud.assistant.get(db, id=assistant_id)
    if not assistant:
        raise HTTPException(
            status_code=404,
            detail="Assistant not found",
        )
    if assistant.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions",
        )
    assistant = crud.assistant.remove(db, id=assistant_id)
    return assistant


@router.get("/{assistant_id}/download")
def download_assistant(
    *,
    db: Session = Depends(deps.get_db),
    assistant_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Download assistant as YAML file"""
    assistant = crud.assistant.get(db, id=assistant_id)
    if not assistant:
        raise HTTPException(
            status_code=404,
            detail="Assistant not found",
        )
    if assistant.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions",
        )
    
    # Create temporary file
    temp_dir = tempfile.gettempdir()
    temp_file = os.path.join(temp_dir, f"assistant_{assistant_id}.yaml")
    
    with open(temp_file, "w") as f:
        f.write(assistant.yaml_content)
    
    return FileResponse(
        temp_file,
        media_type="application/x-yaml",
        filename=f"{assistant.name.lower().replace(' ', '_')}.yaml"
    )
