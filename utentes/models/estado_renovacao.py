# -*- coding: utf-8 -*-

from sqlalchemy import Column, Integer, Text

from .base import DeclarativeBase, PGSQL_SCHEMA_DOMAINS

LICENSED = u'Licenciada'
DE_FACTO = u'Utente de facto';
IRREGULAR = u'Irregular';
PENDING_RENOV_LICENSE = u'Pendente Renovação da licença (DA)';
PENDING_REVIEW_DIR = u'Pendente Revisão Renovação (Direcção)';
PENDING_REVIEW_DJ = u'Pendente Análise Renovação Licença (DJ)';
PENDING_TECH_DECISION = u'Pendente Parecer Técnico Renovação (DT)';
PENDING_EMIT_LICENSE = u'Pendente Emisão Renovação Licença (DJ)';
PENDING_DADOS_LICENSE = u'Pendente Dados Renovação Licença (DJ)';
PENDING_DIR_SIGN = u'Pendente Firma Renovação Licença (Direcção)';

NOT_APPROVED = u'Não aprovada';


NOT_VALID = [
    LICENSED,
    DE_FACTO,
    NOT_APPROVED
]


class EstadoRenovacao(DeclarativeBase):
    __tablename__ = 'licencia_estado_renovacao'
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
