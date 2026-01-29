# upload routes
from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import uuid
from pathlib import Path

router = APIRouter(prefix="/api/uploads", tags=["uploads"])

# uploads folder in backend directory (zelfde als main.py)
UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# toegestane extensies
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}


@router.post("")
async def upload_image(file: UploadFile = File(...)):
    # check extensie
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Bestandstype niet toegestaan. Toegestaan: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # genereer unieke filename
    unique_name = f"{uuid.uuid4()}{ext}"
    file_path = UPLOAD_DIR / unique_name

    # sla bestand op
    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    # return url
    return {
        "filename": unique_name,
        "url": f"/uploads/{unique_name}"
    }
