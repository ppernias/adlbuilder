from typing import Any, Dict, List, Optional, Union

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.assistant import Assistant
from app.schemas.assistant import AssistantCreate, AssistantUpdate


class CRUDAssistant(CRUDBase[Assistant, AssistantCreate, AssistantUpdate]):
    def create(self, db: Session, *, obj_in: AssistantCreate) -> Assistant:
        db_obj = Assistant(
            name=obj_in.name,
            description=obj_in.description,
            yaml_content=obj_in.yaml_content,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
        
    def create_with_user(self, db: Session, *, obj_in: AssistantCreate, user_id: int) -> Assistant:
        db_obj = Assistant(
            name=obj_in.name,
            description=obj_in.description,
            yaml_content=obj_in.yaml_content,
            user_id=user_id,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Assistant]:
        return (
            db.query(Assistant)
            .filter(Assistant.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_name_and_user_id(self, db: Session, *, name: str, user_id: int) -> Optional[Assistant]:
        return db.query(Assistant).filter(Assistant.name == name, Assistant.user_id == user_id).first()


assistant = CRUDAssistant(Assistant)
