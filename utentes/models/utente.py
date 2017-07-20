# -*- coding: utf-8 -*-

from sqlalchemy import Column, Integer, Text, text
from sqlalchemy.orm import relationship

from utentes.models.base import Base, PGSQL_SCHEMA_UTENTES


class Utente(Base):
    __tablename__ = 'utentes'
    __table_args__ = {u'schema': PGSQL_SCHEMA_UTENTES}

    gid = Column(Integer, primary_key=True, server_default=text("nextval('utentes.utentes_gid_seq'::regclass)"))
    nome = Column(Text, nullable=False, unique=True, doc='Nome')
    uten_tipo = Column(Text, doc='Tipo de utente')
    nuit = Column(Text, unique=True, doc='Nuit')
    uten_gere = Column(Text, doc='Nome do Gerente/Presidente')
    uten_memb = Column(Integer, doc='Nro de membros')
    uten_mulh = Column(Integer, doc='Nro de mulheres')
    contacto = Column(Text, doc='Pessoa de contacto')
    email = Column(Text, doc='Email')
    telefone = Column(Text, doc='Telefone')
    loc_provin = Column(Text, doc='Província')
    loc_distri = Column(Text, doc='Distrito')
    loc_posto = Column(Text, doc='Posto administrativo')
    loc_nucleo = Column(Text, doc='Bairro')
    entidade = Column(Text, doc='Tipo de entidade')
    reg_comerc = Column(Text, doc='Nro de Registro Comercial')
    reg_zona = Column(Text, doc='Registrado em')
    observacio = Column(Text, doc='Observações da actividade')

    exploracaos = relationship('Exploracao',
                               backref='utente_rel',
                               passive_deletes=True)

    @staticmethod
    def create_from_json(json):
        u = Utente()
        u.update_from_json(json)
        return u

    def update_from_json(self, json):
        SPECIAL_CASES = ['gid']
        self.gid = json.get('id')
        for column in self.__mapper__.columns.keys():
            if column in SPECIAL_CASES:
                continue
            setattr(self, column, json.get(column))

    def __json__(self, request):
        SPECIAL_CASES = ['gid']
        exploracaos = []
        for e in self.exploracaos:
            exploracaos.append({
                'gid': e.gid,
                'exp_name': e.exp_name,
                'exp_id': e.exp_id,
                'actividade': e.actividade
            })
        payload = {
            'id': self.gid,
            'exploracaos': exploracaos,
        }
        for column in self.__mapper__.columns.keys():
            if column in SPECIAL_CASES:
                continue
            payload[column] = getattr(self, column)

        return payload
