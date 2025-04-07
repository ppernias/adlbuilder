from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class AssistantBase(BaseModel):
    name: str
    description: Optional[str] = None

class AssistantCreate(AssistantBase):
    yaml_content: str

class AssistantUpdate(AssistantBase):
    name: Optional[str] = None
    yaml_content: Optional[str] = None

class AssistantInDBBase(AssistantBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class Assistant(AssistantInDBBase):
    pass

# Schema for YAML validation
class YAMLValidationResponse(BaseModel):
    is_valid: bool
    errors: Optional[List[str]] = None
