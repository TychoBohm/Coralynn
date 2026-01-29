from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.routers.auth import router as auth_router
from app.routers.products import router as products_router
from app.routers.uploads import router as uploads_router

app = FastAPI(
    title="Coralynn Webshop API",
    description="Backend API voor de Coralynn webshop",
    version="1.0.0"
)

# CORS settings (allow all for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# serve uploaded files
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Include routers
app.include_router(auth_router)
app.include_router(products_router)
app.include_router(uploads_router)


@app.get("/api/ping")
def ping():
    return {"status": "connected"}
