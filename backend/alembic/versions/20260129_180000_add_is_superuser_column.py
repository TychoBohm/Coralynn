"""add is_superuser column

Revision ID: add_superuser
Revises: 1e4b1290544c
Create Date: 2026-01-29 18:00:00

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers
revision: str = 'add_superuser'
down_revision: Union[str, None] = '1e4b1290544c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # voeg is_superuser kolom toe, standaard False
    op.add_column('users', sa.Column('is_superuser', sa.Boolean(), nullable=False, server_default='false'))


def downgrade() -> None:
    op.drop_column('users', 'is_superuser')
