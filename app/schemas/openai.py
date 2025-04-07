from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class OpenAIConfigBase(BaseModel):
    selected_model: Optional[str] = None

class OpenAIConfigCreate(OpenAIConfigBase):
    api_key: str

class OpenAIConfigUpdate(OpenAIConfigBase):
    api_key: Optional[str] = None

class OpenAIConfigInDBBase(OpenAIConfigBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class OpenAIConfig(OpenAIConfigInDBBase):
    api_key: str

class OpenAIModel(BaseModel):
    id: str
    name: str

class OpenAIModelsResponse(BaseModel):
    models: List[OpenAIModel]

class OpenAIApiKey(BaseModel):
    api_key: str

class OpenAIKeyValidation(BaseModel):
    valid: bool
    error: Optional[str] = None

class ModelList(BaseModel):
    models: List[OpenAIModel]

class OpenAIConfigStatus(BaseModel):
    exists: bool
    config: Optional[OpenAIConfig] = None

class OpenAIConfigData(BaseModel):
    exists: bool
    config: Optional[OpenAIConfig] = None
    models: List[OpenAIModel] = []
