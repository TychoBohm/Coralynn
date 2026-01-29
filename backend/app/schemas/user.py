# schemas voor validatie
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID


class UserBase(BaseModel):
    email: EmailStr
    phone_number: Optional[str] = None
    address: Optional[str] = None


class UserCreate(UserBase):
    # voor registratie
    password: str


class UserUpdate(BaseModel):
    # voor profiel update
    phone_number: Optional[str] = None
    address: Optional[str] = None


class UserLogin(BaseModel):
    # voor inloggen
    email: EmailStr
    password: str


class UserResponse(UserBase):
    # wat we terugsturen (zonder wachtwoord)
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    # jwt token response
    access_token: str
    token_type: str


class TokenData(BaseModel):
    # data in de token
    email: Optional[str] = None
