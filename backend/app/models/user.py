# user model
from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.database import Base
import uuid


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=True)  # optioneel
    name = Column(String(255), nullable=True)  # optionele naam
    is_superuser = Column(Boolean, default=False, nullable=False)  # admin rechten
    # Opgeslagen checkout/verzend gegevens
    shipping_city = Column(String(255), nullable=True)
    shipping_street = Column(String(255), nullable=True)
    shipping_postal_code = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

