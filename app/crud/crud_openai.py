from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

# Removed encryption import
from app.crud.base import CRUDBase
from app.models.openai_config import OpenAIConfig
from app.schemas.openai import OpenAIConfigCreate, OpenAIConfigUpdate


class CRUDOpenAIConfig(CRUDBase[OpenAIConfig, OpenAIConfigCreate, OpenAIConfigUpdate]):
    def create(self, db: Session, *, obj_in: OpenAIConfigCreate, user_id: int) -> OpenAIConfig:
        db_obj = OpenAIConfig(
            api_key=obj_in.api_key,
            selected_model=obj_in.selected_model,
            user_id=user_id,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: OpenAIConfig, obj_in: Union[OpenAIConfigUpdate, Dict[str, Any]]
    ) -> OpenAIConfig:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        
        # API key is stored directly now, no need for encryption
        
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def get_by_user_id(self, db: Session, *, user_id: int) -> Optional[OpenAIConfig]:
        return db.query(OpenAIConfig).filter(OpenAIConfig.user_id == user_id).first()
    
    def get_api_key(self, db_obj: OpenAIConfig) -> str:
        """Get OpenAI API key"""
        return db_obj.api_key


openai = CRUDOpenAIConfig(OpenAIConfig)
