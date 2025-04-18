from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional, List
from datetime import datetime

# Valid roles for users
VALID_ROLES = ["admin", "editor"]

# User models
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = Field(None, description="User's full name")
    role: Optional[str] = Field(None, description="User role")
    organization: Optional[str] = Field(None, description="User organization")
    position: Optional[str] = Field(None, description="User position in the organization")
    is_active: bool = Field(True, description="Whether the user is active")

class UserCreate(UserBase):
    password: str
    
    @validator('role')
    def validate_role(cls, v):
        if v is not None and v not in VALID_ROLES:
            raise ValueError(f"Role must be one of: {', '.join(VALID_ROLES)}")
        return v

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None
    full_name: Optional[str] = None
    organization: Optional[str] = None
    position: Optional[str] = None
    is_active: Optional[bool] = None
    
    @validator('role')
    def validate_role(cls, v):
        if v is not None and v not in VALID_ROLES:
            raise ValueError(f"Role must be one of: {', '.join(VALID_ROLES)}")
        return v

class User(UserBase):
    id: int
    hashed_password: str
    created_at: datetime
    updated_at: datetime
    position: Optional[str] = Field(None, description="User position in the organization")
    
    class Config:
        orm_mode = True

# Model for API responses - excludes sensitive fields
class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str
