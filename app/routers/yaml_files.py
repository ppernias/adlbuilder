from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query, File, UploadFile, Form
from fastapi.responses import FileResponse, StreamingResponse
from typing import List, Optional, Dict, Any, Literal
from pathlib import Path
import yaml
import json
import csv
import io
import os
import shutil

from app.models.user import User
from app.models.yaml_file import YAMLContent, YAMLFile, HistoryEntry, HistoryList
from app.auth import get_current_active_user, get_user_files, is_file_owned_by_user, assign_file_to_user, remove_file_from_user
from app.utils import validate_yaml_content
from app.utils.schema_processor import generate_default_yaml_from_schema
from app.db import record_history, get_history_list, get_history_detail
from app.routers.schema import get_schema

# Directory to store YAML files
YAML_DIR = Path(__file__).parent.parent.parent / "yaml_files"
YAML_DIR.mkdir(exist_ok=True)

router = APIRouter(prefix="", tags=["yaml"])

@router.get("/yaml-files", response_model=List[str])
async def list_yaml_files(current_user: User = Depends(get_current_active_user)):
    """List all YAML files owned by the current user"""
    return get_user_files(current_user.id)

@router.get("/yaml-files/{filename}", response_model=YAMLFile)
async def get_yaml_file(filename: str, current_user: User = Depends(get_current_active_user)):
    """Get a specific YAML file by filename"""
    # Check if file exists
    file_path = YAML_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"File {filename} not found")
    
    # Check if user owns the file
    if not is_file_owned_by_user(current_user.id, filename):
        raise HTTPException(status_code=403, detail="Not authorized to access this file")
    
    # Read file content
    with open(file_path, "r") as f:
        content = f.read()
    
    # Validate content
    validation_result = validate_yaml_content(content)
    if not validation_result["valid"]:
        return {
            "filename": filename,
            "content": content,
            "validation_error": validation_result
        }
    
    return {"filename": filename, "content": content}

@router.post("/yaml-files/{filename}", response_model=Dict[str, Any])
async def save_yaml_file(
    filename: str, 
    yaml_content: YAMLContent, 
    background_tasks: BackgroundTasks, 
    current_user: User = Depends(get_current_active_user)
):
    """Save a YAML file with the given filename"""
    # Validate YAML content
    validation_result = validate_yaml_content(yaml_content.content)
    if not validation_result["valid"]:
        return validation_result
    
    # Save file
    file_path = YAML_DIR / filename
    file_exists = file_path.exists()
    
    with open(file_path, "w") as f:
        f.write(yaml_content.content)
    
    # Assign file to user if it's a new file
    if not file_exists:
        assign_file_to_user(current_user.id, filename)
        action = "create"
    else:
        # Check if user owns the file for updates
        if not is_file_owned_by_user(current_user.id, filename):
            raise HTTPException(status_code=403, detail="Not authorized to modify this file")
        action = "update"
    
    # Record history in background
    background_tasks.add_task(
        record_history,
        filename=filename,
        action=action,
        content=yaml_content.content,
        user=current_user.email
    )
    
    return {
        "success": True,
        "message": f"File {filename} saved successfully",
        "action": action
    }

@router.delete("/yaml-files/{filename}")
async def delete_yaml_file(
    filename: str, 
    background_tasks: BackgroundTasks, 
    current_user: User = Depends(get_current_active_user)
):
    """Delete a YAML file"""
    # Check if file exists
    file_path = YAML_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"File {filename} not found")
    
    # Check if user owns the file
    if not is_file_owned_by_user(current_user.id, filename):
        raise HTTPException(status_code=403, detail="Not authorized to delete this file")
    
    # Read content before deleting for history
    with open(file_path, "r") as f:
        content = f.read()
    
    # Delete file
    os.remove(file_path)
    
    # Remove file from user's ownership
    remove_file_from_user(current_user.id, filename)
    
    # Record deletion in history
    background_tasks.add_task(
        record_history,
        filename=filename,
        action="delete",
        content=content,
        user=current_user.email
    )
    
    return {"success": True, "message": f"File {filename} deleted successfully"}

@router.post("/validate-yaml", response_model=Dict[str, Any])
async def validate_yaml_endpoint(yaml_content: YAMLContent):
    """Validate YAML content against schema"""
    return validate_yaml_content(yaml_content.content)

@router.get("/history", response_model=Dict[str, Any])
async def get_history(
    filename: Optional[str] = None, 
    action: Optional[str] = None, 
    user: Optional[str] = None, 
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get history of file operations"""
    return get_history_list(filename, action, user, limit, offset)

@router.get("/history/{history_id}", response_model=HistoryEntry)
async def get_history_detail_endpoint(history_id: int):
    """Get detailed history entry including content"""
    history_entry = get_history_detail(history_id)
    if not history_entry:
        raise HTTPException(status_code=404, detail=f"History entry {history_id} not found")
    return history_entry

@router.get("/yaml-files-new", response_model=Dict[str, Any])
async def create_new_yaml_file(
    filename: str = Query(..., description="Name of the file to create"),
    mode: Literal["simple", "advanced"] = Query("simple", description="Mode for creating the file (simple or advanced)"),
    background_tasks: BackgroundTasks = None,
    current_user: User = Depends(get_current_active_user)
):
    """Create a new YAML file with default values from schema"""
    # Check if file already exists
    file_path = YAML_DIR / filename
    if file_path.exists():
        raise HTTPException(status_code=400, detail=f"File {filename} already exists")
    
    # Get the schema
    schema_data = await get_schema(category="custom" if mode == "simple" else None)
    
    # Generate default YAML content based on schema
    default_content = generate_default_yaml_from_schema(schema_data["schema"])
    
    # Save the file directly without using save_yaml_file
    with open(file_path, "w") as f:
        f.write(default_content)
    
    # Assign file to user
    assign_file_to_user(current_user.id, filename)
    
    # Record history in background
    if background_tasks:
        background_tasks.add_task(
            record_history,
            filename=filename,
            action="create",
            content=default_content,
            user=current_user.email
        )
    
    return {
        "success": True,
        "message": f"File {filename} created successfully with default values",
        "filename": filename,
        "mode": mode
    }

@router.get("/yaml-files-edit/{filename}", response_model=Dict[str, Any])
async def get_yaml_file_for_editing(
    filename: str,
    mode: Literal["simple", "advanced"] = Query("simple", description="Mode for editing the file (simple or advanced)"),
    current_user: User = Depends(get_current_active_user)
):
    """Get a YAML file with schema information for editing in simple or advanced mode"""
    # Get the file
    yaml_file = await get_yaml_file(filename, current_user)
    
    # Get the schema filtered by mode
    schema_data = await get_schema(category="custom" if mode == "simple" else None)
    
    return {
        "file": yaml_file,
        "schema": schema_data["schema"],
        "mode": mode
    }

@router.post("/import", response_model=Dict[str, Any])
async def import_yaml_file(
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    user: Optional[str] = None,
    validate_schema: bool = True,
    current_user: User = Depends(get_current_active_user)
):
    """Import a YAML file"""
    # Check file extension
    if not file.filename.endswith(".yaml") and not file.filename.endswith(".yml"):
        raise HTTPException(status_code=400, detail="File must be a YAML file (.yaml or .yml)")
    
    # Read file content
    content = await file.read()
    content_str = content.decode("utf-8")
    
    # Validate content if requested
    if validate_schema:
        validation_result = validate_yaml_content(content_str)
        if not validation_result["valid"]:
            return validation_result
    
    # Save file
    filename = file.filename
    file_path = YAML_DIR / filename
    
    with open(file_path, "wb") as f:
        f.write(content)
    
    # Assign file to user
    assign_file_to_user(current_user.id, filename)
    
    # Record import in history
    if background_tasks:
        background_tasks.add_task(
            record_history,
            filename=filename,
            action="import",
            content=content_str,
            user=current_user.email
        )
    
    return {
        "success": True,
        "message": f"File {filename} imported successfully",
        "filename": filename
    }

@router.get("/export/{filename}")
async def export_yaml_file(
    filename: str,
    format: Literal["yaml", "json", "csv"] = "yaml",
    background_tasks: BackgroundTasks = None,
    current_user: User = Depends(get_current_active_user)
):
    """Export a YAML file in different formats"""
    # Check if file exists
    file_path = YAML_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"File {filename} not found")
    
    # Check if user owns the file
    if not is_file_owned_by_user(current_user.id, filename):
        raise HTTPException(status_code=403, detail="Not authorized to access this file")
    
    # Read file content
    with open(file_path, "r") as f:
        content = f.read()
    
    # Parse YAML content
    try:
        yaml_data = yaml.safe_load(content)
    except yaml.YAMLError as e:
        raise HTTPException(status_code=400, detail=f"Invalid YAML content: {str(e)}")
    
    # Export based on format
    if format == "yaml":
        # Just return the original file
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type="application/x-yaml"
        )
    
    elif format == "json":
        # Convert to JSON
        json_content = json.dumps(yaml_data, indent=2)
        json_filename = filename.rsplit(".", 1)[0] + ".json"
        
        # Return as stream
        return StreamingResponse(
            io.StringIO(json_content),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={json_filename}"}
        )
    
    elif format == "csv":
        # Flatten the YAML structure for CSV
        def flatten_dict(d, parent_key=""):
            items = []
            for k, v in d.items():
                new_key = f"{parent_key}.{k}" if parent_key else k
                if isinstance(v, dict):
                    items.extend(flatten_dict(v, new_key).items())
                elif isinstance(v, list):
                    for i, item in enumerate(v):
                        if isinstance(item, dict):
                            items.extend(flatten_dict(item, f"{new_key}[{i}]").items())
                        else:
                            items.append((f"{new_key}[{i}]", item))
                else:
                    items.append((new_key, v))
            return dict(items)
        
        flat_data = flatten_dict(yaml_data)
        
        # Create CSV content
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Key", "Value"])
        for key, value in flat_data.items():
            writer.writerow([key, value])
        
        # Reset stream position
        output.seek(0)
        
        # Create filename
        csv_filename = filename.rsplit(".", 1)[0] + ".csv"
        
        # Return as stream
        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={csv_filename}"}
        )
    
    # This should never happen due to Literal type
    raise HTTPException(status_code=400, detail=f"Unsupported format: {format}")
