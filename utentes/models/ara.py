# -*- coding: utf-8 -*-

from sqlalchemy import Column, Text
from sqlalchemy.dialects.postgresql.json import JSONB

from utentes.models.base import (
    Base,
    PGSQL_SCHEMA_UTENTES,
)


class Ara(Base):
    __tablename__ = 'datos_aras'
    __table_args__ = {u'schema': PGSQL_SCHEMA_UTENTES}

    id = Column(Text, primary_key=True)
    name = Column(Text, nullable=False, doc='Nome da Ara')
    nuit = Column(Text, nullable=False, doc='Nuit da Ara')
    endereco = Column(JSONB, doc='Direccion')
    conta_bancaria = Column(JSONB, doc='Dados da conta bancária')
    outros = Column(JSONB, doc='Outros dados')
    valores = Column(JSONB, doc='Valores')
    sedes = Column(JSONB, doc='Sedes del Ara')

    def __json__(self, request):
        json = {c: getattr(self, c) for c in self.__mapper__.columns.keys()}
        json['id'] = self.id
        return json
