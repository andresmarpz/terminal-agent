"""create three dummy clients

Revision ID: fa116056110c
Revises: c7d55fce2bef
Create Date: 2025-04-24 17:05:20.636361

"""

from datetime import datetime
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "fa116056110c"
down_revision: Union[str, None] = "c7d55fce2bef"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    clients_table = sa.table(
        "clients",
        sa.column("name", sa.String),
        sa.column("email", sa.String),
        sa.column("country", sa.String),
        sa.column("address", sa.Text),
        sa.column("created_at", sa.DateTime),
        sa.column("updated_at", sa.DateTime),
    )
    now = datetime.now()
    op.bulk_insert(
        clients_table,
        [
            {
                "name": "Samantha Carter",
                "email": "samantha.carter@acmeinc.com",
                "country": "USA",
                "address": "742 Evergreen Terrace, Springfield, IL, USA",
                "created_at": now,
                "updated_at": now,
            },
            {
                "name": "Miguel Hernández",
                "email": "miguel.hernandez@globex.com.mx",
                "country": "Mexico",
                "address": "Av. Insurgentes Sur 1234, Ciudad de México, Mexico",
                "created_at": now,
                "updated_at": now,
            },
            {
                "name": "Sophie Dubois",
                "email": "sophie.dubois@paris-solutions.fr",
                "country": "France",
                "address": "10 Rue de Rivoli, 75001 Paris, France",
                "created_at": now,
                "updated_at": now,
            },
        ],
    )


def downgrade() -> None:
    """Downgrade schema."""
    conn = op.get_bind()
    conn.execute(
        sa.text(
            """
            DELETE FROM clients WHERE email IN (
                :email1, :email2, :email3
            )
            """
        ),
        {
            "email1": "samantha.carter@acmeinc.com",
            "email2": "miguel.hernandez@globex.com.mx",
            "email3": "sophie.dubois@paris-solutions.fr",
        },
    )
