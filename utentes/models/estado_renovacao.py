from sqlalchemy import Column, Integer, Text

from .base import PGSQL_SCHEMA_DOMAINS, DeclarativeBase


LICENSED = "Licenciada"
DE_FACTO = "Utente de facto"
IRREGULAR = "Irregular"
PENDING_RENOV_LICENSE = "Pendente Renovação da licença (DA)"
PENDING_REVIEW_DIR = "Pendente Revisão Renovação (Direcção)"
PENDING_REVIEW_DJ = "Pendente Análise Renovação Licença (DJ)"
PENDING_TECH_DECISION = "Pendente Parecer Técnico Renovação (DT)"
PENDING_EMIT_LICENSE = "Pendente Emisão Renovação Licença (DJ)"
PENDING_DADOS_LICENSE = "Pendente Dados Renovação Licença (DJ)"
PENDING_DIR_SIGN = "Pendente Firma Renovação Licença (Direcção)"
NOT_APPROVED = "Não aprovada"


NOT_VALID = [LICENSED, DE_FACTO, NOT_APPROVED]


class EstadoRenovacao(DeclarativeBase):
    __tablename__ = "licencia_estado_renovacao"
    __table_args__ = {"schema": PGSQL_SCHEMA_DOMAINS}

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
