# auth routes
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from uuid import UUID

from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token, UserLogin, UserUpdate, SetSuperuser
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    decode_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/api/auth", tags=["authentication"])

# voor de authorize knop in swagger
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login/form")


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    # check of user bestaat en wachtwoord klopt
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, str(user.hashed_password)):
        return None
    return user


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    # haal user op uit jwt token
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Kon credentials niet valideren",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    email = payload.get("sub")
    if email is None:
        raise credentials_exception
    
    user = get_user_by_email(db, str(email))
    if user is None:
        raise credentials_exception
    
    return user


async def get_current_superuser(
    current_user: User = Depends(get_current_user)
) -> User:
    # check of user superuser is
    if not bool(current_user.is_superuser):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Alleen superusers hebben toegang"
        )
    return current_user


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # kijk of email al in gebruik is
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is al geregistreerd"
        )
    
    # hash wachtwoord en sla user op
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
        phone_number=user_data.phone_number,
        name=user_data.name
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@router.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    # login met json body
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Ongeldige email of wachtwoord",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login/form", response_model=Token)
def login_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # login via form data (voor swagger)
    user = authenticate_user(db, form_data.username, form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Ongeldige email of wachtwoord",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    # geeft ingelogde user terug
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # update profiel van ingelogde user
    if user_data.phone_number is not None:
        current_user.phone_number = user_data.phone_number  # type: ignore
    if user_data.name is not None:
        current_user.name = user_data.name  # type: ignore
    if user_data.shipping_city is not None:
        current_user.shipping_city = user_data.shipping_city  # type: ignore
    if user_data.shipping_street is not None:
        current_user.shipping_street = user_data.shipping_street  # type: ignore
    if user_data.shipping_postal_code is not None:
        current_user.shipping_postal_code = user_data.shipping_postal_code  # type: ignore
    
    db.commit()
    db.refresh(current_user)
    return current_user


@router.put("/users/{user_id}/superuser", response_model=UserResponse)
def set_superuser_status(
    user_id: UUID,
    data: SetSuperuser,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    # alleen superusers kunnen andere users superuser maken
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gebruiker niet gevonden"
        )
    
    user.is_superuser = data.is_superuser  # type: ignore
    db.commit()
    db.refresh(user)
    return user


@router.get("/users", response_model=list[UserResponse])
def get_all_users(
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    # alleen superusers kunnen alle users zien
    return db.query(User).all()
