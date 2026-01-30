"""add shipping fields to users

Revision ID: 20260130_140000
Revises: 20260130_120000
Create Date: 2026-01-30 14:00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20260130_140000'
down_revision: Union[str, None] = '20260130_120000'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Voeg shipping velden toe aan users tabel
    op.add_column('users', sa.Column('shipping_city', sa.String(255), nullable=True))
    op.add_column('users', sa.Column('shipping_street', sa.String(255), nullable=True))
    op.add_column('users', sa.Column('shipping_postal_code', sa.String(20), nullable=True))


def downgrade() -> None:
    # Verwijder shipping velden
    op.drop_column('users', 'shipping_postal_code')
    op.drop_column('users', 'shipping_street')
    op.drop_column('users', 'shipping_city')
