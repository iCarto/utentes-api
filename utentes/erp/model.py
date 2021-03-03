import datetime

# https://stackoverflow.com/questions/55361186/type-hinting-sqlalchemy-query-result
from typing import NamedTuple

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text, text

from utentes.models.base import PGSQL_SCHEMA_UTENTES, Base
from utentes.models.exploracao import Exploracao, ExploracaoBase
from utentes.models.facturacao import Facturacao


MANUAL_SYNC_TIME = datetime.datetime(year=2021, month=3, day=1)


class ExploracaosERP(Base):
    """
    Mantiene la relación entre las explotaciones de SIRHA y los clientes del ERP
    """

    __tablename__ = "exploracaos_erp"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    id = Column(Integer, primary_key=True)
    exploracao_gid = Column(
        ForeignKey("utentes.exploracaos.gid", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
    )
    erp_id = Column(Text, nullable=True)
    link_id = Column(Text)
    created_at = Column(DateTime, nullable=False, server_default=text("now()"))
    exported_at = Column(DateTime, nullable=True)

    def update_link_id(self, exp: Exploracao) -> str:
        """
        Updates the link_id of this entity and returns it
        """
        self.link_id = str(exp.gid).zfill(8)
        return self.link_id


class FacturacaoERP(Base):
    """
    Mantiene la relación entre las facturas de SIRHA y las facturas del ERP
    """

    __tablename__ = "facturacao_erp"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    id = Column(Integer, primary_key=True)
    facturacao_gid = Column(
        ForeignKey("utentes.exploracaos.gid", ondelete="SET NULL", onupdate="CASCADE"),
        nullable=True,
    )
    erp_id = Column(Text, nullable=True)
    link_id = Column(Text)
    created_at = Column(DateTime, nullable=False, server_default=text("now()"))
    exported_at = Column(DateTime, nullable=True)

    def update_link_id(self, invoice: Facturacao) -> str:
        """
        Updates the link_id of this entity and returns it
        """
        self.link_id = str(invoice.gid).zfill(8)
        return self.link_id


class InvoicesResultSet(NamedTuple):
    invoice: Facturacao
    exploracao_base: ExploracaoBase
    exploracao_erp: ExploracaosERP
    invoice_erp: FacturacaoERP


class ClientsResultSet(NamedTuple):
    exploracao: Exploracao
    exploracao_erp: ExploracaosERP
    actividade: str
