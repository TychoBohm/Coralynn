# product routes
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List
from uuid import UUID
from pathlib import Path
import os

from app.db.database import get_db
from app.models.product import Product, ProductImage
from app.models.user import User
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductImageCreate,
    ProductImageResponse,
    ReorderRequest,
)
from app.routers.auth import get_current_superuser

router = APIRouter(prefix="/api/products", tags=["products"])

# uploads folder
UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"


def delete_image_file(image_url: str):
    # verwijder bestand van disk als het een lokale upload is
    if "/uploads/" in image_url:
        filename = image_url.split("/uploads/")[-1]
        file_path = UPLOAD_DIR / filename
        if file_path.exists():
            os.remove(file_path)


@router.get("", response_model=list[ProductResponse])
def get_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    # haal alle producten op, gesorteerd op display_order
    products = db.query(Product).order_by(Product.display_order).offset(skip).limit(limit).all()
    return products


# reorder endpoints - MOETEN VOOR /{product_id} routes staan!
@router.put("/reorder", status_code=status.HTTP_200_OK)
def reorder_products(
    reorder_data: ReorderRequest,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    """Herorden producten (alleen superuser)"""
    for i, product_id in enumerate(reorder_data.ids):
        product = db.query(Product).filter(Product.id == product_id).first()
        if product:
            product.display_order = i  # type: ignore
    
    db.commit()
    return {"message": "Volgorde bijgewerkt"}


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: UUID, db: Session = Depends(get_db)):
    # haal 1 product op
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product niet gevonden"
        )
    return product


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: ProductCreate,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    # maak nieuw product aan (alleen superuser)
    new_product = Product(
        title=product_data.title,
        description=product_data.description,
        price=product_data.price
    )
    db.add(new_product)
    db.flush()  # om id te krijgen

    # voeg images toe
    for i, image_url in enumerate(product_data.images or []):
        image = ProductImage(
            product_id=new_product.id,
            image_url=image_url,
            sort_order=i
        )
        db.add(image)

    db.commit()
    db.refresh(new_product)
    return new_product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: UUID,
    product_data: ProductUpdate,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    # update bestaand product (alleen superuser)
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product niet gevonden"
        )

    if product_data.title is not None:
        product.title = product_data.title  # type: ignore
    if product_data.description is not None:
        product.description = product_data.description  # type: ignore
    if product_data.price is not None:
        product.price = product_data.price  # type: ignore

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: UUID,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    # verwijder product (alleen superuser)
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product niet gevonden"
        )

    # verwijder eerst alle image bestanden van disk
    for image in product.images:
        delete_image_file(str(image.image_url))

    db.delete(product)
    db.commit()
    return None


# image endpoints
@router.post("/{product_id}/images", response_model=ProductImageResponse, status_code=status.HTTP_201_CREATED)
def add_product_image(
    product_id: UUID,
    image_data: ProductImageCreate,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    # voeg image toe aan product (alleen superuser)
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product niet gevonden"
        )

    image = ProductImage(
        product_id=product_id,
        image_url=image_data.image_url,
        sort_order=image_data.sort_order
    )
    db.add(image)
    db.commit()
    db.refresh(image)
    return image


@router.delete("/{product_id}/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_image(
    product_id: UUID,
    image_id: UUID,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    # verwijder image van product (alleen superuser)
    image = db.query(ProductImage).filter(
        ProductImage.id == image_id,
        ProductImage.product_id == product_id
    ).first()
    
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Afbeelding niet gevonden"
        )

    # verwijder bestand van disk
    delete_image_file(str(image.image_url))

    db.delete(image)
    db.commit()
    return None


@router.put("/{product_id}/images/reorder", status_code=status.HTTP_200_OK)
def reorder_product_images(
    product_id: UUID,
    reorder_data: ReorderRequest,
    current_user: User = Depends(get_current_superuser),
    db: Session = Depends(get_db)
):
    """Herorden afbeeldingen van een product (alleen superuser)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product niet gevonden"
        )
    
    for i, image_id in enumerate(reorder_data.ids):
        image = db.query(ProductImage).filter(
            ProductImage.id == image_id,
            ProductImage.product_id == product_id
        ).first()
        if image:
            image.sort_order = i  # type: ignore
    
    db.commit()
    return {"message": "Afbeelding volgorde bijgewerkt"}
