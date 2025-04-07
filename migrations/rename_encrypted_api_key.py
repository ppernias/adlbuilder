from alembic import op
import sqlalchemy as sa

# Revision ID: rename_encrypted_api_key
# Revises: 
# Create Date: 2025-04-06

# revision identifiers, used by Alembic.
revision = 'rename_encrypted_api_key'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Rename the column from encrypted_api_key to api_key
    op.alter_column('openaiconfig', 'encrypted_api_key', new_column_name='api_key')


def downgrade():
    # Rename the column back to encrypted_api_key
    op.alter_column('openaiconfig', 'api_key', new_column_name='encrypted_api_key')
