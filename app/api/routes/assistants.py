from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import FileResponse
import os
import tempfile
from datetime import datetime

from app import crud, models, schemas
from app.api import deps
from app.db.session import get_db
from app.services import yaml_service

router = APIRouter(prefix="/assistants")


@router.get("/template", response_model=schemas.YAMLContent)
def get_assistant_template(
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get a default assistant template.
    """
    template = yaml_service.get_default_template()
    return template


@router.get("/", response_model=List[schemas.Assistant])
def read_assistants(
    db=Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve assistants for the current user.
    """
    assistants = crud.assistant.get_multi_by_user(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    return assistants


@router.post("/", response_model=schemas.Assistant)
def create_assistant(
    *,
    db=Depends(get_db),
    assistant_in: schemas.AssistantCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new assistant for the current user.
    """
    # Validate YAML content
    validation_result = yaml_service.validate_yaml(assistant_in.yaml_content)
    if not validation_result['valid']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid YAML content: {validation_result['errors']}"
        )
    
    # Create assistant with user ID
    assistant = crud.assistant.create_with_user(
        db=db, obj_in=assistant_in, user_id=current_user.id
    )
    return assistant


@router.get("/{assistant_id}", response_model=schemas.Assistant)
def read_assistant(
    *,
    db=Depends(get_db),
    assistant_id: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get assistant by ID.
    """
    assistant = crud.assistant.get(db=db, id=assistant_id)
    if not assistant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assistant not found"
        )
    if assistant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return assistant


@router.put("/{assistant_id}", response_model=schemas.Assistant)
def update_assistant(
    *,
    db=Depends(get_db),
    assistant_id: int,
    assistant_in: schemas.AssistantUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Update an assistant.
    """
    assistant = crud.assistant.get(db=db, id=assistant_id)
    if not assistant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assistant not found"
        )
    if assistant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Validate YAML content if provided
    if assistant_in.yaml_content:
        validation_result = yaml_service.validate_yaml(assistant_in.yaml_content)
        if not validation_result['valid']:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid YAML content: {validation_result['errors']}"
            )
    
    assistant = crud.assistant.update(db=db, db_obj=assistant, obj_in=assistant_in)
    return assistant


@router.delete("/{assistant_id}", response_model=schemas.Assistant)
def delete_assistant(
    *,
    db=Depends(get_db),
    assistant_id: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete an assistant.
    """
    assistant = crud.assistant.get(db=db, id=assistant_id)
    if not assistant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assistant not found"
        )
    if assistant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    assistant = crud.assistant.remove(db=db, id=assistant_id)
    return assistant


@router.post("/validate", response_model=schemas.YAMLValidation)
def validate_yaml_content(
    *,
    yaml_data: schemas.YAMLContent,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Validate YAML content against the assistant schema.
    """
    result = yaml_service.validate_yaml(yaml_data.yaml_content)
    return result


@router.post("/upload", response_model=schemas.YAMLUploadResponse)
def upload_yaml_file(
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Upload and validate a YAML file.
    """
    if not file.filename.endswith(('.yaml', '.yml')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a YAML file with .yaml or .yml extension"
        )
    
    try:
        # Read file content
        content = file.file.read().decode('utf-8')
        
        # Validate YAML content
        validation_result = yaml_service.validate_yaml(content)
        
        # Return validation result and content if valid
        return {
            "valid": validation_result["valid"],
            "errors": validation_result.get("errors", []),
            "yaml_content": content if validation_result["valid"] else None
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing file: {str(e)}"
        )
    finally:
        file.file.close()


@router.get("/{assistant_id}/download")
def download_assistant(
    *,
    db=Depends(get_db),
    assistant_id: int,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Download assistant YAML file.
    """
    assistant = crud.assistant.get(db=db, id=assistant_id)
    if not assistant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assistant not found"
        )
    if assistant.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    # Create a temporary file with the YAML content
    with tempfile.NamedTemporaryFile(delete=False, suffix=".yaml") as tmp:
        tmp.write(assistant.yaml_content.encode())
        tmp_path = tmp.name
    
    # Use the assistant name for the download filename
    filename = f"{assistant.name.lower().replace(' ', '_')}_{datetime.now().strftime('%Y%m%d')}.yaml"
    
    # Return the file as a download
    return FileResponse(
        path=tmp_path,
        filename=filename,
        media_type="application/x-yaml",
        background=lambda: os.remove(tmp_path)  # Clean up the temporary file
    )


