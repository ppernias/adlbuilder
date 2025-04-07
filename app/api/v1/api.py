from fastapi import APIRouter

from app.api.v1.endpoints import login, users, utils, openai, assistants

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(utils.router, prefix="/utils", tags=["utils"])
api_router.include_router(openai.router, prefix="/openai", tags=["openai"])
api_router.include_router(assistants.router, prefix="/assistants", tags=["assistants"])
