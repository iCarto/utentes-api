# -*- coding: utf-8 -*-

from sqlalchemy import Boolean, Column, Integer, Numeric, Text, DateTime, UniqueConstraint, text
from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql.json import JSONB

from utentes.models.base import (
    Base,
    PGSQL_SCHEMA_UTENTES,
)
from utentes.models.facturacao_fact_estado import PENDING_CONSUMPTION


class Facturacao(Base):
    __tablename__ = 'facturacao'
    __table_args__ = (
        UniqueConstraint('exploracao', 'ano', 'mes'),
        {'schema': PGSQL_SCHEMA_UTENTES}
    )
    __mapper_args__ = {
        'order_by': ['exploracao', 'ano', 'mes']
    }

    gid = Column(Integer, primary_key=True, server_default=text("nextval('utentes.facturacao_gid_seq'::regclass)"))
    exploracao = Column(ForeignKey('utentes.exploracaos.gid', ondelete='CASCADE', onupdate='CASCADE'), nullable=False)
    # exploracao = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=text('now()'))
    ano = Column(Text, nullable=False, server_default=text("to_char(now(), 'YYYY'::text)"))
    mes = Column(Text, nullable=False, server_default=text("to_char(now(), 'MM'::text)"))
    observacio = Column(JSONB)
    fact_estado = Column(Text, nullable=False, server_default=text("'{}'::text".format(PENDING_CONSUMPTION)))
    fact_tipo = Column(Text, nullable=False, server_default=text("'Mensal'::text"))
    fact_id = Column(Text, unique=True)
    pago_lic = Column(Boolean)
    pagos = Column(Boolean)
    c_licencia_sup = Column(Numeric(10, 2))
    c_licencia_sub = Column(Numeric(10, 2))
    consumo_tipo_sup = Column(Text, nullable=False, server_default=text("'Fixo'::text"))
    consumo_fact_sup = Column(Numeric(10, 2))
    taxa_fixa_sup = Column(Numeric(10, 2))
    taxa_uso_sup = Column(Numeric(10, 2))
    pago_mes_sup = Column(Numeric(10, 2))
    pago_iva_sup = Column(Numeric(10, 2))
    iva_sup = Column(Numeric(10, 2))
    consumo_tipo_sub = Column(Text, nullable=False, server_default=text("'Fixo'::text"))
    consumo_fact_sub = Column(Numeric(10, 2))
    taxa_fixa_sub = Column(Numeric(10, 2))
    taxa_uso_sub = Column(Numeric(10, 2))
    pago_mes_sub = Column(Numeric(10, 2))
    pago_iva_sub = Column(Numeric(10, 2))
    iva_sub = Column(Numeric(10, 2))
    iva = Column(Numeric(10, 2))
    pago_mes = Column(Numeric(10, 2))
    pago_iva = Column(Numeric(10, 2))

    def __json__(self, request):
        json = {c: getattr(self, c) for c in self.__mapper__.columns.keys()}
        del json['gid']
        json['id'] = self.gid
        return json
