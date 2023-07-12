"""create knowledge_config table

Revision ID: 9d8fa6a0bd90
Revises: 18e8e1ee3f03
Create Date: 2023-07-10 09:13:28.304147

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9d8fa6a0bd90'
down_revision = '18e8e1ee3f03'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('knowledge_config',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('knowledge_id', sa.Integer(), nullable=True),
    sa.Column('key', sa.String(), nullable=True),
    sa.Column('value', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('knowledge_config')
    # ### end Alembic commands ###
