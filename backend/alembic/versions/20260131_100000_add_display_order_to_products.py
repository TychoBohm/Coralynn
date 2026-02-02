"""add display_order to products

Revision ID: 20260131_100000
Revises: 20260130_150000
Create Date: 2026-01-31 10:00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20260131_100000'
down_revision: Union[str, None] = '20260130_150000'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('products', sa.Column('display_order', sa.Numeric(), nullable=True, server_default='0'))


def downgrade() -> None:
    op.drop_column('products', 'display_order')
