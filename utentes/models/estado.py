from sqlalchemy import Column, Integer, Text
from sqlalchemy.dialects.postgresql import ARRAY

from .base import PGSQL_SCHEMA_DOMAINS, DeclarativeBase


class Estado(DeclarativeBase):
    __tablename__ = "licencia_estado"
    __table_args__ = {"schema": PGSQL_SCHEMA_DOMAINS}

    category = Column(Text, nullable=False, primary_key=True)
    key = Column(Text, nullable=False, primary_key=True)
    value = Column(Text)
    ordering = Column(Integer)
    parent = Column(Text, primary_key=True)
    tooltip = Column(Text)
    app = Column(ARRAY(Text), doc="app")

    def __json__(self, request):
        return {
            "category": self.category,
            "text": self.key,
            "alias": self.value,
            "order": self.ordering,
            "parent": self.parent,
            "tooltip": self.tooltip,
        }
