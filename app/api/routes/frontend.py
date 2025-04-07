from fastapi import APIRouter, Request, Depends, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
import datetime

from app.api import deps
from app.core.config import settings
from app.db.session import get_db
from app import crud


def get_openai_config_status(db, user_id):
    """Get the OpenAI configuration status for a user"""
    if not user_id:
        return False
        
    config = crud.openai_config.get_by_user_id(db, user_id=user_id)
    return bool(config and config.api_key and config.selected_model)


def get_profile_completion_status(db, user_id):
    """Check if user profile is complete (has role and organization)"""
    if not user_id:
        return False
        
    user = crud.user.get(db, id=user_id)
    return bool(user and user.role and user.organization)

router = APIRouter()

# Configure templates
templates = Jinja2Templates(directory="app/templates")


@router.get("/", response_class=HTMLResponse)
async def index(request: Request, db=Depends(get_db)):
    """Render the index page"""
    # Try to get current user from cookie
    current_user = deps.get_current_user_from_cookie(request, db)
    openai_configured = False
    profile_complete = False
    
    if current_user:
        openai_configured = get_openai_config_status(db, current_user.id)
        profile_complete = get_profile_completion_status(db, current_user.id)
    
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request, 
            "now": datetime.datetime.now(),
            "openai_configured": openai_configured,
            "profile_complete": profile_complete,
            "current_user": current_user
        }
    )


@router.get("/login", response_class=HTMLResponse)
async def login(request: Request, db=Depends(get_db)):
    """Render the login page"""
    # Try to get current user from cookie
    current_user = deps.get_current_user_from_cookie(request, db)
    openai_configured = False
    profile_complete = False
    
    if current_user:
        openai_configured = get_openai_config_status(db, current_user.id)
        profile_complete = get_profile_completion_status(db, current_user.id)
    
    return templates.TemplateResponse(
        "login.html",
        {
            "request": request, 
            "now": datetime.datetime.now(),
            "openai_configured": openai_configured,
            "profile_complete": profile_complete,
            "current_user": current_user
        }
    )


@router.get("/register", response_class=HTMLResponse)
async def register(request: Request, db=Depends(get_db)):
    """Render the registration page"""
    # Check if there are any users in the system
    is_first_user = True  # This should be determined by database query
    
    # Try to get current user from cookie
    current_user = deps.get_current_user_from_cookie(request, db)
    openai_configured = False
    profile_complete = False
    
    if current_user:
        openai_configured = get_openai_config_status(db, current_user.id)
        profile_complete = get_profile_completion_status(db, current_user.id)
    
    return templates.TemplateResponse(
        "register.html",
        {
            "request": request,
            "now": datetime.datetime.now(),
            "is_first_user": is_first_user,
            "openai_configured": openai_configured,
            "profile_complete": profile_complete,
            "current_user": current_user
        }
    )


@router.get("/profile", response_class=HTMLResponse)
async def profile(request: Request, db=Depends(get_db)):
    """Render the profile page"""
    # Try to get current user from cookie
    current_user = deps.get_current_user_from_cookie(request, db)
    openai_configured = False
    profile_complete = False
    
    if current_user:
        openai_configured = get_openai_config_status(db, current_user.id)
        profile_complete = get_profile_completion_status(db, current_user.id)
    
    return templates.TemplateResponse(
        "profile.html",
        {
            "request": request, 
            "now": datetime.datetime.now(),
            "openai_configured": openai_configured,
            "profile_complete": profile_complete,
            "current_user": current_user
        }
    )


@router.get("/openai-config", response_class=HTMLResponse)
async def openai_config(request: Request):
    """Render the OpenAI configuration page"""
    # Get query parameters for messages
    success = request.query_params.get("success")
    saved = request.query_params.get("saved")
    error = request.query_params.get("error")
    
    messages = []
    if success:
        messages.append({"type": "green", "text": "API key validated successfully!"})
    if saved:
        messages.append({"type": "green", "text": "Configuration saved successfully!"})
    if error:
        messages.append({"type": "red", "text": f"Error: {error}"})
    
    # Try to get current user from cookie/session
    token = request.cookies.get("access_token")
    current_user = None
    config = None
    models = []
    
    if token:
        try:
            from sqlalchemy.orm import Session
            from app.db.session import get_db
            from app import crud
            from app import models as models_module
            
            # Get database session
            db = next(get_db())
            
            # Get current user
            try:
                current_user = deps.get_current_user_from_cookie(request, db)
                
                # Get user's OpenAI config
                if current_user:
                    config = crud.openai_config.get_by_user_id(db, user_id=current_user.id)
                    
                    # Get models if we have a config with API key
                    if config and config.api_key:
                        try:
                            from app.services.openai_service import OpenAIService
                            models = OpenAIService.get_available_models(config.api_key)
                        except Exception as e:
                            messages.append({"type": "yellow", "text": f"Warning: Could not load models. {str(e)}"})
            except Exception as e:
                # If token is invalid or expired, we'll just render the page without user data
                pass
        except Exception as e:
            # Handle any other errors
            pass
    
    # Determine if OpenAI is fully configured
    openai_configured = bool(config and config.api_key and config.selected_model)
    
    return templates.TemplateResponse(
        "openai_config.html", {
            "request": request, 
            "now": datetime.datetime.now(),
            "messages": messages,
            "config": config,
            "models": models,
            "current_user": current_user,
            "openai_configured": openai_configured
        }
    )


@router.get("/assistants", response_class=HTMLResponse)
async def assistants_list(request: Request, db=Depends(get_db)):
    """Render the assistants list page"""
    # Try to get current user from cookie
    current_user = deps.get_current_user_from_cookie(request, db)
    openai_configured = False
    profile_complete = False
    
    if current_user:
        openai_configured = get_openai_config_status(db, current_user.id)
        profile_complete = get_profile_completion_status(db, current_user.id)
    
    return templates.TemplateResponse(
        "assistants.html",
        {
            "request": request, 
            "now": datetime.datetime.now(),
            "openai_configured": openai_configured,
            "profile_complete": profile_complete,
            "current_user": current_user
        }
    )


@router.get("/assistants/new", response_class=HTMLResponse)
async def new_assistant(request: Request, db=Depends(get_db)):
    """Render the new assistant form"""
    # Try to get current user from cookie
    current_user = deps.get_current_user_from_cookie(request, db)
    openai_configured = False
    profile_complete = False
    
    if current_user:
        openai_configured = get_openai_config_status(db, current_user.id)
        profile_complete = get_profile_completion_status(db, current_user.id)
    
    return templates.TemplateResponse(
        "assistant_form.html",
        {
            "request": request,
            "now": datetime.datetime.now(),
            "mode": "new",
            "openai_configured": openai_configured,
            "profile_complete": profile_complete,
            "current_user": current_user
        }
    )


@router.get("/assistants/{assistant_id}", response_class=HTMLResponse)
async def edit_assistant(request: Request, assistant_id: str, db=Depends(get_db)):
    """Render the edit assistant form"""
    # Try to get current user from cookie
    current_user = deps.get_current_user_from_cookie(request, db)
    openai_configured = False
    profile_complete = False
    
    if current_user:
        openai_configured = get_openai_config_status(db, current_user.id)
        profile_complete = get_profile_completion_status(db, current_user.id)
    
    return templates.TemplateResponse(
        "assistant_form.html",
        {
            "request": request,
            "now": datetime.datetime.now(),
            "mode": "edit",
            "openai_configured": openai_configured,
            "profile_complete": profile_complete,
            "current_user": current_user
        }
    )
