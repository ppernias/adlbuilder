from typing import Any

from fastapi import APIRouter, Depends, Body
from pydantic import BaseModel
import os

from app import models
from app.api import deps
from app.services.openai_service import OpenAIService
from app.crud import openai_config
# Removed decrypt_api_key import

router = APIRouter()


class TextEnhanceRequest(BaseModel):
    text: str
    instruction: str


@router.post("/enhance-text")
def enhance_text(
    *,
    request: TextEnhanceRequest,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """Enhance text using OpenAI"""
    
    # Assuming you have the OpenAI config in the database
    from sqlalchemy.orm import Session
    from app.db.session import get_db
    
    db = next(get_db())  # Get a DB session
    
    # Get OpenAI config
    config = openai_config.get_by_user_id(db, user_id=current_user.id)
    if not config or not config.selected_model:
        return {"enhanced": False, "message": "OpenAI not configured", "text": request.text}
    
    # Get API key (no longer encrypted)
    api_key = config.api_key
    
    # Use OpenAI to enhance text
    enhanced_text = OpenAIService.enhance_text(
        api_key=api_key,
        model=config.selected_model,
        prompt=request.instruction,
        text=request.text
    )
    
    if enhanced_text:
        return {"enhanced": True, "text": enhanced_text}
    
    return {"enhanced": False, "message": "Failed to enhance text", "text": request.text}
