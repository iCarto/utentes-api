# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql.json import JSONB

from utentes.models.base import PGSQL_SCHEMA_DOMAINS, Base


class Ara(Base):
    __tablename__ = "datos_aras"
    __table_args__ = {"schema": PGSQL_SCHEMA_DOMAINS}

    id = Column(Text, primary_key=True)
    name = Column(Text, nullable=False, doc="Nome da Ara")
    nuit = Column(Text, nullable=False, doc="Nuit da Ara")
    endereco = Column(ARRAY(Text), doc="Dirección")
    conta_bancaria = Column(JSONB, doc="Dados da conta bancária")
    outros = Column(JSONB, doc="Outros dados")
    valores = Column(JSONB, doc="Valores")
    sede = Column(JSONB, doc="Sede del Ara")
    unidades = Column(JSONB, doc="Unidades del Ara")

    def __json__(self, request):
        json = {c: getattr(self, c) for c in list(self.__mapper__.columns.keys())}
        json["id"] = self.id
        return json
