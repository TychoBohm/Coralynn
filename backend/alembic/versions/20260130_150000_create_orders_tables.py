"""create orders tables

Revision ID: 20260130_150000
Revises: 20260130_140000
Create Date: 2026-01-30 15:00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision: str = '20260130_150000'
down_revision: Union[str, None] = '20260130_140000'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create orders table
    op.create_table(
        'orders',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('order_number', sa.String(50), unique=True, nullable=False, index=True),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('customer_name', sa.String(255), nullable=False),
        sa.Column('customer_email', sa.String(255), nullable=False),
        sa.Column('customer_phone', sa.String(20), nullable=True),
        sa.Column('shipping_method', sa.String(20), nullable=False),
        sa.Column('shipping_city', sa.String(255), nullable=True),
        sa.Column('shipping_street', sa.String(255), nullable=True),
        sa.Column('shipping_postal_code', sa.String(20), nullable=True),
        sa.Column('subtotal', sa.Float, nullable=False),
        sa.Column('shipping_cost', sa.Float, nullable=False, server_default='0'),
        sa.Column('total', sa.Float, nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='pending'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )
    
    # Create order_items table
    op.create_table(
        'order_items',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('order_id', UUID(as_uuid=True), sa.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id', UUID(as_uuid=True), sa.ForeignKey('products.id', ondelete='SET NULL'), nullable=True),
        sa.Column('product_title', sa.String(255), nullable=False),
        sa.Column('product_price', sa.Float, nullable=False),
        sa.Column('product_image_url', sa.Text, nullable=True),
        sa.Column('size', sa.String(20), nullable=True),
        sa.Column('quantity', sa.Integer, nullable=False),
        sa.Column('line_total', sa.Float, nullable=False),
    )
    
    # Create indexes
    op.create_index('ix_orders_user_id', 'orders', ['user_id'])
    op.create_index('ix_order_items_order_id', 'order_items', ['order_id'])


def downgrade() -> None:
    op.drop_index('ix_order_items_order_id', 'order_items')
    op.drop_index('ix_orders_user_id', 'orders')
    op.drop_table('order_items')
    op.drop_table('orders')
