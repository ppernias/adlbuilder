from sqlalchemy import Column, String
from alembic import op
import sqlalchemy as sa

# Revisión: add_role_organization_fields
# Crea: 2025-04-06 18:16:29.000000


def upgrade():
    # Añadir columnas role y organization a la tabla users
    op.add_column('user', sa.Column('role', sa.String(), nullable=True))
    op.add_column('user', sa.Column('organization', sa.String(), nullable=True))


def downgrade():
    # Eliminar columnas role y organization de la tabla users
    op.drop_column('user', 'organization')
    op.drop_column('user', 'role')
