"""create base products

Revision ID: c7d55fce2bef
Revises: adbdc7970282
Create Date: 2025-04-24 16:56:06.832184

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "c7d55fce2bef"
down_revision: Union[str, None] = "adbdc7970282"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    products_table = sa.table(
        "products",
        sa.column("name", sa.String),
        sa.column("description", sa.Text),
        sa.column("price", sa.Numeric(10, 2)),
    )
    op.bulk_insert(
        products_table,
        [
            {
                "name": "segfault coffee, 12oz",
                "description": "A bold, premium 12oz coffee blend for developers who need to debug their mornings.",
                "price": 40.00,
            },
            {
                "name": "coffee machine",
                "description": "A reliable coffee machine designed to keep your workflow energized all day long.",
                "price": 112.00,
            },
            {
                "name": "pack of 6 mugs",
                "description": "A set of six durable mugs, perfect for sharing coffee breaks with your team.",
                "price": 48.00,
            },
        ],
    )


def downgrade() -> None:
    """Downgrade schema."""
    conn = op.get_bind()
    conn.execute(
        sa.text(
            """
            DELETE FROM products WHERE name IN (
                :name1, :name2, :name3
            )
            """
        ),
        {
            "name1": "segfault coffee, 12oz",
            "name2": "coffee machine",
            "name3": "pack of 6 mugs",
        },
    )
