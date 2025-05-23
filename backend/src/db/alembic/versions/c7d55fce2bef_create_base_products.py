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
        sa.column("image", sa.String),
    )
    op.bulk_insert(
        products_table,
        [
            {
                "name": "segfault coffee, 12oz.",
                "description": "A bold, premium 12oz coffee blend for developers who need to debug their mornings.",
                "price": 40.00,
                "image": "/assets/products/segfault-coffee.png",
            },
            {
                "name": "coffee machine.",
                "description": "A reliable coffee machine designed to keep your workflow energized all day long.",
                "price": 112.00,
                "image": "/assets/products/coffee-machine.png",
            },
            {
                "name": "terminal coffee mug.",
                "description": "A set of six durable mugs, perfect for sharing coffee breaks with your team.",
                "price": 48.00,
                "image": "/assets/products/coffee-mug.png",
            },
            {
                "name": "brew grinder.",
                "description": "A high-quality grinder for the perfect coffee consistency every time.",
                "price": 75.00,
                "image": "/assets/products/brew-grinder.png",
            },
            {
                "name": "french press.",
                "description": "An elegant french press for brewing rich, flavorful coffee.",
                "price": 65.00,
                "image": "/assets/products/french-press.png",
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
                :name1, :name2, :name3, :name4, :name5
            )
            """
        ),
        {
            "name1": "segfault coffee, 12oz",
            "name2": "coffee machine",
            "name3": "pack of 6 mugs",
            "name4": "brew grinder",
            "name5": "french press",
        },
    )
