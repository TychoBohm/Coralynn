from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth import router as auth_router

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

# Include routers
app.include_router(auth_router)


@app.get("/api/ping")
def ping():
    return {"status": "connected"}
