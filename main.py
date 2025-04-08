import os
from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.routes import auth, users, openai, assistants, frontend
from app.core.config import settings
from app.db.session import engine, SessionLocal
from app.db.base import Base

# Create database tables
Base.metadata.create_all(bind=engine)

# Create static directories if they don't exist
os.makedirs("app/static/css", exist_ok=True)
os.makedirs("app/static/js", exist_ok=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="ADL Builder - Assistant Definition Language Builder",
    version="0.1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Include API routes
app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["auth"])
app.include_router(users.router, prefix=settings.API_V1_STR, tags=["users"])
app.include_router(openai.router, prefix=settings.API_V1_STR, tags=["openai"])
app.include_router(assistants.router, prefix=settings.API_V1_STR, tags=["assistants"])

# Include Frontend routes (no prefix for HTML routes)
app.include_router(frontend.router, tags=["frontend"])


@app.get("/api/health")
def health_check():
    """Simple health check endpoint"""
    return {"status": "ok", "name": settings.PROJECT_NAME}


if __name__ == "__main__":
    import uvicorn
    import logging
    
    # Configurar logging para mostrar mensajes de depuración
    logging.basicConfig(
        level=logging.DEBUG,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler()  # Enviar logs a la consola
        ]
    )
    # Configurar niveles de logging para bibliotecas externas
    logging.getLogger('uvicorn').setLevel(logging.INFO)
    logging.getLogger('sqlalchemy').setLevel(logging.WARNING)
    
    # Iniciar el servidor
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
