from app.routers.auth import router as auth_router
from app.routers.admin import router as admin_router
from app.routers.yaml_files import router as yaml_files_router
from app.routers.schema import router as schema_router

__all__ = ['auth_router', 'admin_router', 'yaml_files_router', 'schema_router']
