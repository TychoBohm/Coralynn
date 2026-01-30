# wishlist router
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from uuid import UUID
from typing import Annotated

from app.db.database import get_db
from app.models.wishlist import WishlistItem
from app.models.product import Product
from app.models.user import User
from app.routers.auth import get_current_user
from app.schemas.product import ProductResponse

router = APIRouter(prefix="/api/wishlist", tags=["wishlist"])


@router.get("", response_model=list[ProductResponse])
def get_wishlist(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    """Haal alle producten op in de wishlist van de huidige gebruiker"""
    wishlist_items = db.execute(
        select(WishlistItem).where(WishlistItem.user_id == current_user.id)
    ).scalars().all()
    
    # haal de producten op
    products = []
    for item in wishlist_items:
        product = db.get(Product, item.product_id)
        if product:
            products.append(product)
    
    return products


@router.post("/{product_id}", status_code=status.HTTP_201_CREATED)
def add_to_wishlist(
    product_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    """Voeg een product toe aan de wishlist"""
    # check of product bestaat
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product niet gevonden")
    
    # check of al in wishlist
    existing = db.execute(
        select(WishlistItem).where(
            WishlistItem.user_id == current_user.id,
            WishlistItem.product_id == product_id
        )
    ).scalar_one_or_none()
    
    if existing:
        raise HTTPException(status_code=400, detail="Product staat al in je wishlist")
    
    # toevoegen
    wishlist_item = WishlistItem(
        user_id=current_user.id,
        product_id=product_id
    )
    db.add(wishlist_item)
    db.commit()
    
    return {"message": "Product toegevoegd aan wishlist"}


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def remove_from_wishlist(
    product_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    """Verwijder een product uit de wishlist"""
    wishlist_item = db.execute(
        select(WishlistItem).where(
            WishlistItem.user_id == current_user.id,
            WishlistItem.product_id == product_id
        )
    ).scalar_one_or_none()
    
    if not wishlist_item:
        raise HTTPException(status_code=404, detail="Product niet in je wishlist")
    
    db.delete(wishlist_item)
    db.commit()
    
    return {"message": "Product verwijderd uit wishlist"}


@router.get("/check/{product_id}")
def check_in_wishlist(
    product_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    """Check of een product in de wishlist staat"""
    wishlist_item = db.execute(
        select(WishlistItem).where(
            WishlistItem.user_id == current_user.id,
            WishlistItem.product_id == product_id
        )
    ).scalar_one_or_none()
    
    return {"in_wishlist": wishlist_item is not None}


@router.get("/ids", response_model=list[str])
def get_wishlist_product_ids(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_db)
):
    """Haal alle product IDs op in de wishlist (voor snelle checks in frontend)"""
    wishlist_items = db.execute(
        select(WishlistItem.product_id).where(WishlistItem.user_id == current_user.id)
    ).scalars().all()
    
    return [str(pid) for pid in wishlist_items]
