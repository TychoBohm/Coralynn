# product routes
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID

from app.db.database import get_db
from app.models.product import Product, ProductImage
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductImageCreate,
    ProductImageResponse
)

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[ProductResponse])
def get_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    # haal alle producten op
    products = db.query(Product).offset(skip).limit(limit).all()
    return products


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
def create_product(product_data: ProductCreate, db: Session = Depends(get_db)):
    # maak nieuw product aan
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
    db: Session = Depends(get_db)
):
    # update bestaand product
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
def delete_product(product_id: UUID, db: Session = Depends(get_db)):
    # verwijder product
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product niet gevonden"
        )

    db.delete(product)
    db.commit()
    return None


# image endpoints
@router.post("/{product_id}/images", response_model=ProductImageResponse, status_code=status.HTTP_201_CREATED)
def add_product_image(
    product_id: UUID,
    image_data: ProductImageCreate,
    db: Session = Depends(get_db)
):
    # voeg image toe aan product
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
    db: Session = Depends(get_db)
):
    # verwijder image van product
    image = db.query(ProductImage).filter(
        ProductImage.id == image_id,
        ProductImage.product_id == product_id
    ).first()
    
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Afbeelding niet gevonden"
        )

    db.delete(image)
    db.commit()
    return None
