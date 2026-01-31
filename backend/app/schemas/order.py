# order schemas
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class OrderItemCreate(BaseModel):
    product_id: Optional[UUID] = None
    product_title: str
    product_price: float
    product_image_url: Optional[str] = None
    size: Optional[str] = None
    quantity: int


class OrderItemResponse(BaseModel):
    id: UUID
    product_id: Optional[UUID] = None
    product_title: str
    product_price: float
    product_image_url: Optional[str] = None
    size: Optional[str] = None
    quantity: int
    line_total: float

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    shipping_method: str  # 'bezorgen' of 'ophalen'
    shipping_city: Optional[str] = None
    shipping_street: Optional[str] = None
    shipping_postal_code: Optional[str] = None
    items: List[OrderItemCreate]


class OrderResponse(BaseModel):
    id: UUID
    order_number: str
    user_id: UUID
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    shipping_method: str
    shipping_city: Optional[str] = None
    shipping_street: Optional[str] = None
    shipping_postal_code: Optional[str] = None
    subtotal: float
    shipping_cost: float
    total: float
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    """Vereenvoudigde response voor lijst weergave"""
    id: UUID
    order_number: str
    total: float
    status: str
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True
