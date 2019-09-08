# -*- coding: utf-8 -*-

from sqlalchemy import Column, Integer, Text

import utentes.models.constants as c

from .base import PGSQL_SCHEMA_DOMAINS, DeclarativeBase


PENDING_CONSUMPTION = u"Pendente Acrescentar Consumo (DT)"
PENDING_INVOICE = u"Pendente Emisão Factura (DF)"
PENDING_PAYMENT = u"Pendente Pagamento (DF)"
PAID = u"Pagada"
NOT_INVOIZABLE = u"Não facturable"


class FacturacaoFactEstado(DeclarativeBase):
    __tablename__ = "facturacao_fact_estado"
    __table_args__ = {"schema": PGSQL_SCHEMA_DOMAINS}
    __mapper_args__ = {"order_by": ["category", "ordering", "key"]}

    ESTADOS_FACTURABLES = [c.K_LICENSED, c.K_DE_FACTO]

    category = Column(Text, nullable=False, primary_key=True)
    key = Column(Text, nullable=False, primary_key=True)
    value = Column(Text)
    ordering = Column(Integer)
    parent = Column(Text, primary_key=True)
    tooltip = Column(Text)

    def __json__(self, request):
        return {
            "category": self.category,
            "text": self.key,
            "alias": self.value,
            "order": self.ordering,
            "parent": self.parent,
            "tooltip": self.tooltip,
        }
