from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

# Import routers
from app.routers import auth_router, admin_router, yaml_files_router, schema_router

# Create FastAPI app
app = FastAPI(title="YAML Editor API", description="API for YAML validation and editing")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(yaml_files_router)
app.include_router(schema_router)

# Root endpoint
@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <html>
        <head>
            <title>YAML Editor</title>
        </head>
        <body>
            <h1>YAML Editor API</h1>
            <p>API for YAML validation and editing.</p>
            <p>Visit <a href="/docs">/docs</a> for API documentation.</p>
        </body>
    </html>
    """
