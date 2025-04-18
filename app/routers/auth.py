from fastapi import APIRouter, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordRequestForm
from typing import List, Optional

from app.models.user import User, UserCreate, UserUpdate, Token, UserResponse
from app.auth import (
    authenticate_user, create_access_token, get_current_active_user, 
    get_current_admin_user, create_user, update_user, delete_user, list_users,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

import datetime

router = APIRouter(prefix="", tags=["auth"])

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate):
    """Register a new user"""
    try:
        return create_user(user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login and get access token"""
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user

@router.put("/users/me", response_model=UserResponse)
async def update_current_user(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_active_user)
):
    """Update current user information"""
    # Convert Pydantic model to dict, excluding None values
    update_data = {k: v for k, v in user_data.dict().items() if v is not None}
    
    # Regular users can only update certain fields
    if current_user.role != "admin":
        # Remove fields that regular users shouldn't be able to change
        for field in ["role", "is_active"]:
            if field in update_data:
                del update_data[field]
    
    try:
        updated_user = update_user(current_user.id, update_data)
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")
        return updated_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/users/me/change-password", response_model=UserResponse)
async def change_password(
    current_password: str = Form(...),
    new_password: str = Form(...),
    current_user: User = Depends(get_current_active_user)
):
    """Change current user's password"""
    # Verify current password
    user = authenticate_user(current_user.email, current_password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect current password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update password
    try:
        updated_user = update_user(current_user.id, {"password": new_password})
        if not updated_user:
            raise HTTPException(status_code=404, detail="User not found")
        return updated_user
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
