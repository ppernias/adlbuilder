from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class OpenAIConfig(Base):
    __tablename__ = "openaiconfig"  # Especificar el nombre exacto de la tabla en la base de datos
    
    id = Column(Integer, primary_key=True, index=True)
    api_key = Column(String, nullable=False)
    selected_model = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("User", backref="openai_config")
