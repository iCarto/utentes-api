# -*- coding: utf-8 -*-

from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    Numeric,
    Text,
    DateTime,
    UniqueConstraint,
    text,
    Date,
    func,
)
from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql.json import JSONB
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.sql.expression import case, and_, null

from utentes.models.base import Base, PGSQL_SCHEMA_UTENTES
from utentes.models.facturacao_fact_estado import PENDING_CONSUMPTION


class Facturacao(Base):
    __tablename__ = "facturacao"
    __table_args__ = (
        UniqueConstraint("exploracao", "ano", "mes"),
        {"schema": PGSQL_SCHEMA_UTENTES},
    )
    __mapper_args__ = {"order_by": ["exploracao", "ano", "mes"]}

    gid = Column(
        Integer,
        primary_key=True,
        server_default=text("nextval('utentes.facturacao_gid_seq'::regclass)"),
    )
    exploracao = Column(
        ForeignKey("utentes.exploracaos.gid", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
    # exploracao = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=text("now()"))
    ano = Column(
        Text, nullable=False, server_default=text("to_char(now(), 'YYYY'::text)")
    )
    mes = Column(
        Text, nullable=False, server_default=text("to_char(now(), 'MM'::text)")
    )
    observacio = Column(JSONB)
    fact_estado = Column(
        Text,
        nullable=False,
        server_default=text("'{}'::text".format(PENDING_CONSUMPTION)),
    )
    fact_tipo = Column(Text, nullable=False, server_default=text("'Mensal'::text"))
    pago_lic = Column(Boolean)
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
    juros = Column(Numeric(10, 2))
    pago_mes = Column(Numeric(10, 2))
    pago_iva = Column(Numeric(10, 2))
    fact_id = Column(Text, unique=True)
    recibo_id = Column(Text, unique=True)
    fact_date = Column(Date)
    recibo_date = Column(Date)

    @hybrid_property
    def consumo_lic(self):
        # es la suma del consumo licenciado para la licencia subterránea y el consumo licenciado para la licencia superficial
        return func.coalesce(self.c_licencia_sub, 0) + func.coalesce(
            self.c_licencia_sup, 0
        )

    @hybrid_property
    def consumo(self):
        # es la suma del consumo facturado para la licencia subterránea y el consumo facturado para la licencia superficial
        # en caso de que no hayan introducido ningún consumo facturado en la factura, entonces el consumo facturado es el consumo licenciado
        return case(
            [
                (
                    and_(
                        self.consumo_fact_sub == null(), self.consumo_fact_sup == null()
                    ),
                    self.consumo_lic,
                )
            ],
            else_=func.coalesce(self.consumo_fact_sub, 0)
            + func.coalesce(self.consumo_fact_sup, 0),
        )

    def __json__(self, request):
        json = {c: getattr(self, c) for c in self.__mapper__.columns.keys()}
        del json["gid"]
        json["id"] = self.gid
        return json

    @staticmethod
    def json_fact_order_key(factura):
        return factura["ano"] + factura["mes"]
