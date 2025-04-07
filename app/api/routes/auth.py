from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from app.core import security
from app.db.session import get_db

router = APIRouter()


@router.post("/login/access-token", response_model=schemas.Token)
def login_access_token(
    db=Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud.user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/login/register", response_model=schemas.User)
def register_user(
    *,
    db=Depends(get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new user without the need to be logged in.
    The first user registered will be made an admin.
    """
    # Check if there are any users in the system
    users = crud.user.get_multi(db, skip=0, limit=1)
    is_first_user = len(users) == 0
    
    # Check if user already exists
    user = crud.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="A user with this email already exists.",
        )
    
    # If this is the first user, make them an admin
    if is_first_user:
        user_in.is_admin = True
    else:
        # If not the first user, prevent setting is_admin to True
        user_in.is_admin = False
    
    user = crud.user.create(db, obj_in=user_in)
    return user
