"""replace address column with name

Revision ID: 20260130_120000
Revises: create_wishlist
Create Date: 2026-01-30 12:00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '20260130_120000'
down_revision: Union[str, None] = 'create_wishlist'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Verwijder address kolom en voeg name kolom toe
    op.drop_column('users', 'address')
    op.add_column('users', sa.Column('name', sa.String(255), nullable=True))


def downgrade() -> None:
    # Herstel address kolom en verwijder name kolom
    op.drop_column('users', 'name')
    op.add_column('users', sa.Column('address', sa.String(500), nullable=True))
