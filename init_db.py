import os
import sys
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.core.config import settings
from app.db.session import SessionLocal, engine
from app.db.base import Base

# Make sure all SQL Alchemy models are imported (app.db.base) before initializing DB
# otherwise, SQL Alchemy might fail to initialize relationships properly


def init() -> None:
    # Create tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # Create static directories if they don't exist
    os.makedirs("app/static/css", exist_ok=True)
    os.makedirs("app/static/js", exist_ok=True)
    
    # Create default admin user if no users exist
    create_first_user(db)

    db.close()


def create_first_user(db: Session) -> None:
    """
    Create an initial admin user if no users exist in the database.
    """
    user = crud.user.get_by_email(db, email="admin@adlbuilder.com")
    if not user:
        print("Creating first admin user...")
        user_in = schemas.UserCreate(
            email="admin@adlbuilder.com",
            password="adminpassword",  # This should be changed after first login
            full_name="Admin User",
            username="admin",
            is_admin=True,
        )
        user = crud.user.create(db, obj_in=user_in)
        print(f"Admin user created with ID: {user.id}")
        
        # Create sample assistant for demo
        sample_assistant = schemas.AssistantCreate(
            name="Asistente de Ejemplo",
            description="Un asistente de demostración para mostrar la funcionalidad de ADL Builder",
            yaml_content="""# Assistant Definition
name: asistente_demo
description: Un asistente de ejemplo para demostración
version: 1.0.0
model: gpt-4
prompt: |
  Eres un asistente muy útil y amigable.
  
  Responde a las preguntas del usuario de manera concisa y precisa.
  
  Siempre sé educado y respetuoso.
  
  Usa ejemplos cuando sea útil para ilustrar tus explicaciones.
system_prompt: |
  Saluda al usuario al inicio de la conversación. Preséntate como un asistente de IA.
  
  Si el usuario parece confundido, ofrece ayuda adicional.
  
  Si no sabes la respuesta a una pregunta, admítelo honestamente.
"""
        )
        assistant = crud.assistant.create_with_user(db, obj_in=sample_assistant, user_id=user.id)
        print(f"Sample assistant created with ID: {assistant.id}")
    else:
        print("Admin user already exists.")


def main() -> None:
    print("Initializing database...")
    init()
    print("Database initialized successfully.")


if __name__ == "__main__":
    main()
