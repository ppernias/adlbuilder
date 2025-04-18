from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List

from app.models.user import User, UserUpdate, UserResponse
from app.auth import (
    get_current_admin_user, update_user, delete_user, list_users,
    get_user_files_by_email
)

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users", response_model=List[UserResponse])
async def admin_list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(get_current_admin_user)
):
    """List all users (admin only)"""
    users = list_users(skip, limit)
    return [UserResponse(**user.dict()) for user in users]

@router.get("/users/{user_id}", response_model=UserResponse)
async def admin_get_user(
    user_id: int,
    current_user: User = Depends(get_current_admin_user)
):
    """Get a specific user by ID (admin only)"""
    user = update_user(user_id, {})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/users/{user_id}", response_model=UserResponse)
async def admin_update_user(
    user_id: int,
    user_data: UserUpdate,
    current_user: User = Depends(get_current_admin_user)
):
    """Update a user (admin only)"""
    # Convert Pydantic model to dict, excluding None values
    update_data = {k: v for k, v in user_data.dict().items() if v is not None}
    
    # Prevent admins from downgrading themselves
    if current_user.id == user_id and "role" in update_data and update_data["role"] != "admin":
        raise HTTPException(
            status_code=400,
            detail="Admins cannot downgrade their own role"
        )
    
    try:
        updated_user = update_user(user_id, update_data)
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")
        return updated_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/users/{user_id}")
async def admin_delete_user(
    user_id: int,
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a user (admin only)"""
    # Prevent admins from deleting themselves
    if current_user.id == user_id:
        raise HTTPException(
            status_code=400,
            detail="Admins cannot delete their own account"
        )
    
    success = delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"detail": "User deleted successfully"}

@router.get("/users/{user_email}/files", response_model=List[str])
async def admin_get_user_files(
    user_email: str,
    current_user: User = Depends(get_current_admin_user)
):
    """Get all YAML files owned by a specific user (admin only)"""
    files = get_user_files_by_email(user_email)
    return files
