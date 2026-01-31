# orders router
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import random
import string
import time

from app.db.database import get_db
from app.models.order import Order, OrderItem
from app.models.user import User
from app.schemas.order import OrderCreate, OrderResponse, OrderListResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/orders", tags=["orders"])


def generate_order_number() -> str:
    """Genereer een uniek ordernummer"""
    timestamp = hex(int(time.time()))[2:].upper()
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"COR-{timestamp}-{random_part}"


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Maak een nieuwe bestelling aan"""
    
    # Bereken subtotaal
    subtotal = sum(item.product_price * item.quantity for item in order_data.items)
    
    # Verzendkosten
    shipping_cost = 0.0 if order_data.shipping_method == "ophalen" else 4.95
    
    # Totaal
    total = subtotal + shipping_cost
    
    # Genereer ordernummer
    order_number = generate_order_number()
    
    # Maak order aan
    new_order = Order(
        order_number=order_number,
        user_id=current_user.id,
        customer_name=order_data.customer_name,
        customer_email=order_data.customer_email,
        customer_phone=order_data.customer_phone,
        shipping_method=order_data.shipping_method,
        shipping_city=order_data.shipping_city,
        shipping_street=order_data.shipping_street,
        shipping_postal_code=order_data.shipping_postal_code,
        subtotal=subtotal,
        shipping_cost=shipping_cost,
        total=total,
        status="pending"
    )
    
    db.add(new_order)
    db.flush()  # Om order.id te krijgen
    
    # Voeg order items toe
    for item in order_data.items:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            product_title=item.product_title,
            product_price=item.product_price,
            product_image_url=item.product_image_url,
            size=item.size,
            quantity=item.quantity,
            line_total=item.product_price * item.quantity
        )
        db.add(order_item)
    
    db.commit()
    db.refresh(new_order)
    
    return new_order


@router.get("", response_model=List[OrderListResponse])
def get_my_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Haal alle bestellingen van de ingelogde gebruiker op"""
    orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).order_by(Order.created_at.desc()).all()
    
    return orders


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Haal een specifieke bestelling op"""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id
    ).first()
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bestelling niet gevonden"
        )
    
    return order
