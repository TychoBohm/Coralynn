"""create wishlist table

Revision ID: create_wishlist
Revises: add_superuser
Create Date: 2026-01-30 10:00:00

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers
revision: str = 'create_wishlist'
down_revision: Union[str, None] = 'add_superuser'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'wishlist_items',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id', UUID(as_uuid=True), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint('user_id', 'product_id', name='unique_user_product_wishlist')
    )
    op.create_index('ix_wishlist_items_user_id', 'wishlist_items', ['user_id'])


def downgrade() -> None:
    op.drop_index('ix_wishlist_items_user_id')
    op.drop_table('wishlist_items')
