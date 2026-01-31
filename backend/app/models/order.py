# order models
from sqlalchemy import Column, String, DateTime, Integer, Float, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base
import uuid


class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    order_number = Column(String(50), unique=True, nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Klant gegevens (kopie van op moment van bestelling)
    customer_name = Column(String(255), nullable=False)
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(20), nullable=True)
    
    # Verzending
    shipping_method = Column(String(20), nullable=False)  # 'bezorgen' of 'ophalen'
    shipping_city = Column(String(255), nullable=True)
    shipping_street = Column(String(255), nullable=True)
    shipping_postal_code = Column(String(20), nullable=True)
    
    # Totalen
    subtotal = Column(Float, nullable=False)
    shipping_cost = Column(Float, nullable=False, default=0)
    total = Column(Float, nullable=False)
    
    # Status
    status = Column(String(50), default="pending", nullable=False)  # pending, processing, shipped, delivered, cancelled
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relaties
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    user = relationship("User", backref="orders")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=True)  # nullable voor als product verwijderd wordt
    
    # Product info (kopie van op moment van bestelling)
    product_title = Column(String(255), nullable=False)
    product_price = Column(Float, nullable=False)
    product_image_url = Column(Text, nullable=True)
    size = Column(String(20), nullable=True)
    quantity = Column(Integer, nullable=False)
    line_total = Column(Float, nullable=False)  # price * quantity
    
    # Relatie
    order = relationship("Order", back_populates="items")
