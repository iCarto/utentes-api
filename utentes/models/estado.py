# -*- coding: utf-8 -*-

from sqlalchemy import Column, Integer, Text

from .base import DeclarativeBase, PGSQL_SCHEMA_DOMAINS

LICENSED = u'Licenciada'
DE_FACTO = u'Utente de facto'
IRREGULAR = u'Irregular'
PENDING_TECH_DECISION = u'Pendente Parecer Técnico (DT)'
PENDING_EMIT_LICENSE = u'Pendente Emisão Licença (DJ)'
PENDING_DIR_SIGN = u'Pendente Firma Licença (Direcção)'
PENDING_FIELD_VISIT = u'Pendente Visita Campo (DT)'


class Estado(DeclarativeBase):
    __tablename__ = 'licencia_estado'
    __table_args__ = {u'schema': PGSQL_SCHEMA_DOMAINS}

    category = Column(Text, nullable=False, primary_key=True)
    key = Column(Text, nullable=False, primary_key=True)
    value = Column(Text)
    ordering = Column(Integer)
    parent = Column(Text, primary_key=True)
    tooltip = Column(Text)

    def __json__(self, request):
        return {
            'category': self.category,
            'text': self.key,
            'alias': self.value,
            'order': self.ordering,
            'parent': self.parent,
            'tooltip': self.tooltip
        }
