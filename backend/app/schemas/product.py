# product schemas
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from decimal import Decimal


class ProductImageBase(BaseModel):
    image_url: str
    sort_order: Optional[int] = 0


class ProductImageCreate(ProductImageBase):
    pass


class ProductImageResponse(ProductImageBase):
    id: UUID

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: Decimal


class ProductCreate(ProductBase):
    # lijst van image urls bij aanmaken
    images: Optional[list[str]] = []


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None


class ProductResponse(ProductBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    images: list[ProductImageResponse] = []

    class Config:
        from_attributes = True
