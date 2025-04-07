from app.schemas.user import User, UserCreate, UserUpdate, UserInDB
from app.schemas.token import Token, TokenPayload
from app.schemas.openai import (
    OpenAIConfig, OpenAIConfigCreate, OpenAIConfigUpdate,
    OpenAIModel, OpenAIModelsResponse, OpenAIConfigStatus, ModelList,
    OpenAIConfigData
)
from app.schemas.assistant import (
    Assistant, AssistantCreate, AssistantUpdate,
    YAMLValidationResponse
)

# Esquemas adicionales necesarios para las rutas API
from pydantic import BaseModel
from typing import List, Dict, Optional, Any


class OpenAIApiKey(BaseModel):
    api_key: str


class OpenAIKeyValidation(BaseModel):
    valid: bool
    error: Optional[str] = None


class ModelList(BaseModel):
    models: List[OpenAIModel]


class YAMLContent(BaseModel):
    yaml_content: str


class YAMLValidation(BaseModel):
    valid: bool
    errors: Optional[List[str]] = None


class YAMLUploadResponse(BaseModel):
    valid: bool
    errors: Optional[List[str]] = None
    yaml_content: Optional[str] = None
