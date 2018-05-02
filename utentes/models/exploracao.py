# -*- coding: utf-8 -*-

from sqlalchemy import Boolean, Column, Integer, Date, Numeric, Text, DateTime
from sqlalchemy.dialects.postgresql.json import JSONB

from sqlalchemy import ForeignKey, text
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from geoalchemy2.functions import GenericFunction

from utentes.lib.schema_validator.validation_exception import ValidationException
from utentes.lib.formatter.formatter import to_decimal, to_date
from utentes.models.base import (
    Base,
    PGSQL_SCHEMA_UTENTES,
    update_array,
    update_geom,
    update_area
)
from utentes.models.fonte import Fonte
from utentes.models.licencia import Licencia
from utentes.models.actividade import Actividade


class ST_Multi(GenericFunction):
    name = 'ST_Multi'
    type = Geometry


class Exploracao(Base):
    __tablename__ = 'exploracaos'
    __table_args__ = {u'schema': PGSQL_SCHEMA_UTENTES}
    __mapper_args__ = {
        'order_by': 'exp_id'
    }

    REQUERIMENTO_FIELDS = [
        'carta_re', 'ficha_pe', 'ident_pro', 'certi_reg', 'duat', 'licen_am', 'mapa', 'licen_fu',
        'carta_re_v', 'ficha_pe_v', 'ident_pro_v', 'certi_reg_v', 'duat_v', 'licen_am_v', 'mapa_v',
        'licen_fu_v', 'anali_doc', 'soli_visit', 'p_unid', 'p_tec', 'doc_legal',
        'p_juri', 'p_rel', 'req_obs', 'estado_lic', 'created_at', 'exp_name'
    ]

    READ_ONLY = ['created_at']

    gid = Column(Integer, primary_key=True, server_default=text("nextval('utentes.exploracaos_gid_seq'::regclass)"))
    exp_id = Column(Text, nullable=False, unique=True, doc='Número da exploração')
    exp_name = Column(Text, nullable=False, doc='Nome da exploração')
    d_soli = Column(Date, doc='Data da solicitação')
    pagos = Column(Boolean, doc='Utente ao corrente dos pagamaneto')
    observacio = Column(Text, doc='Observações')
    loc_provin = Column(Text, doc='Província')  # NOT NULL after some estado_lic
    loc_distri = Column(Text, doc='Distrito')   # NOT NULL after some estado_lic
    loc_posto = Column(Text, doc='Posto administrativo')  # NOT NULL after some estado_lic
    loc_nucleo = Column(Text, doc='Bairro')
    loc_endere = Column(Text, doc='Endereço')
    loc_unidad = Column(Text, doc='Unidade')
    loc_bacia = Column(Text, doc='Bacia')
    loc_subaci = Column(Text, doc='Sub-bacia')
    loc_rio = Column(Text, doc='Rio')
    c_soli = Column(Numeric(10, 2), doc='Consumo mensal solicitado ')
    c_licencia = Column(Numeric(10, 2), doc='Consumo mensal licenciado')
    c_real = Column(Numeric(10, 2), doc='Consumo mensal real')
    c_estimado = Column(Numeric(10, 2), doc='Consumo mensal estimado ')
    area = Column(Numeric(10, 4), doc='')
    the_geom = Column(Geometry('MULTIPOLYGON', '32737'), index=True)
    utente = Column(ForeignKey(u'utentes.utentes.gid', ondelete=u'CASCADE', onupdate=u'CASCADE'), nullable=False)
    estado_lic = Column(Text, nullable=False, doc='Estado')
    created_at = Column(DateTime, nullable=False, server_default=text('now()'), doc='Data creación requerimento')
    carta_re = Column(Boolean, nullable=False, server_default=text('false'), doc='Carta de requerimento')
    ficha_pe = Column(Boolean, nullable=False, server_default=text('false'), doc='Ficha de pedido preenchida')
    ident_pro = Column(Boolean, nullable=False, server_default=text('false'), doc='Identificação do proprietário')
    certi_reg = Column(Boolean, nullable=False, server_default=text('false'), doc='Certificado de registro comercial')
    duat = Column(Boolean, nullable=False, server_default=text('false'), doc='DUAT')
    licen_am = Column(Boolean, nullable=False, server_default=text('false'), doc='Licença ambiental (se é preciso)')
    mapa = Column(Boolean, nullable=False, server_default=text('false'), doc='Mapa de localização')
    licen_fu = Column(Boolean, nullable=False, server_default=text('false'), doc='Licença de apertura de poço/furo  (se é preciso)')
    carta_re_v = Column(Boolean, nullable=False, server_default=text('false'), doc='Carta de requerimento (validada)')
    ficha_pe_v = Column(Boolean, nullable=False, server_default=text('false'), doc='Ficha de pedido preenchida (validada)')
    ident_pro_v = Column(Boolean, nullable=False, server_default=text('false'), doc='Identificação do proprietário (validada)')
    certi_reg_v = Column(Boolean, nullable=False, server_default=text('false'), doc='Certificado de registro comercial (validada)')
    duat_v = Column(Boolean, nullable=False, server_default=text('false'), doc='DUAT (validada)')
    licen_am_v = Column(Boolean, nullable=False, server_default=text('false'), doc='Licença ambiental (se é preciso) (validada)')
    mapa_v = Column(Boolean, nullable=False, server_default=text('false'), doc='Mapa de localização (validada)')
    licen_fu_v = Column(Boolean, nullable=False, server_default=text('false'), doc='Licença de apertura de poço/furo  (se é preciso) (validada)')
    anali_doc = Column(Boolean, nullable=False, server_default=text('false'), doc='Análise da documentação')
    soli_visit = Column(Boolean, nullable=False, server_default=text('false'), doc='Solicitação da vistoria')
    p_unid = Column(Boolean, nullable=False, server_default=text('false'), doc='Parecer da Unidade')
    p_tec = Column(Boolean, nullable=False, server_default=text('false'), doc='Parecer Técnico')
    doc_legal = Column(Boolean, nullable=False, server_default=text('false'), doc='Documentação legal')
    p_juri = Column(Boolean, nullable=False, server_default=text('false'), doc='Parecer Técnico')
    p_rel = Column(Boolean, nullable=False, server_default=text('false'), doc='Parecer de instituições relevantes')
    req_obs = Column(JSONB, doc='Observações requerimento')
    ara = Column(Text, nullable=False, doc='ARA')

    licencias = relationship(u'Licencia',
                             cascade="all, delete-orphan",
                             # backref='exploracao_rel',
                             passive_deletes=True)
    fontes = relationship(u'Fonte',
                          cascade="all, delete-orphan",
                          # backref='exploracao_rel',
                          passive_deletes=True)
    actividade = relationship(u'Actividade',
                              cascade="all, delete-orphan",
                              # backref='exploracao_rel',
                              uselist=False,
                              passive_deletes=True)

    def update_from_json_requerimento(self, json):
        for column in (set(self.REQUERIMENTO_FIELDS) - set(self.READ_ONLY)):
            setattr(self, column, json.get(column))
        for lic in self.licencias:
            lic.estado = json.get('estado_lic')

    def update_from_json(self, json):
        self.gid = json.get('id')
        self.exp_id = json.get('exp_id')
        # self.exp_name = json.get('exp_name')
        self.pagos = json.get('pagos')
        self.d_soli = to_date(json.get('d_soli'))
        self.observacio = json.get('observacio')
        self.loc_provin = json.get('loc_provin')
        self.loc_distri = json.get('loc_distri')
        self.loc_posto = json.get('loc_posto')
        self.loc_nucleo = json.get('loc_nucleo')
        self.loc_endere = json.get('loc_endere')
        self.loc_unidad = json.get('loc_unidad')
        self.loc_bacia = json.get('loc_bacia')
        self.loc_subaci = json.get('loc_subaci')
        self.loc_rio = json.get('loc_rio')
        self.c_soli = to_decimal(json.get('c_soli'))
        self.c_licencia = to_decimal(json.get('c_licencia'))
        self.c_real = to_decimal(json.get('c_real'))
        self.c_estimado = to_decimal(json.get('c_estimado'))
        self.the_geom = update_geom(self.the_geom, json)

        self.update_from_json_requerimento(json)
        update_area(self, json)



        self.update_and_validate_activity(json)

        # update relationships
        update_array(self.fontes,
                     json.get('fontes'),
                     Fonte.create_from_json)

        update_array(self.licencias,
                     json.get('licencias'),
                     Licencia.create_from_json)
        for lic in self.licencias:
            lic.generate_lic_nro(self.exp_id)

    def update_and_validate_activity(self, json):
        actividade_json = json.get('actividade')
        if json.get('geometry_edited'):
            actividade_json['area_exploracao_for_calcs'] = self.area
        actividade_json['exp_id'] = json.get('exp_id')

        if not self.actividade:
            actv = Actividade.create_from_json(actividade_json)
            msgs = self.validate_activity(actv, json.get('actividade'), json)
            if len(msgs) > 0:
                raise ValidationException({'error': msgs})
            self.actividade = actv
        elif self.actividade:
            msgs = self.validate_activity(self.actividade, actividade_json, json)
            if len(msgs) > 0:
                raise ValidationException({'error': msgs})
            self.actividade.update_from_json(actividade_json)

        if actividade_json.get('tipo') == u'Agricultura de Regadio':
            self.c_estimado = self.actividade.c_estimado

    def validate_activity(self, activity, attributes, json):
        msgs = []
        statuses = [Licencia.implies_validate_activity(lic['estado']) for lic in json['licencias']]
        if any(statuses):
            msgs = activity.validate(attributes)
        return msgs

    @staticmethod
    def create_from_json(body):
        e = Exploracao()
        e.update_from_json(body)
        return e

    def __json__(self, request):
        the_geom = None
        if self.the_geom is not None:
            import json
            the_geom = json.loads(request.db.query(self.the_geom.ST_Transform(4326).ST_AsGeoJSON()).first()[0])
        payload = {
            'type': 'Feature',
            'properties': {
                'id': self.gid,
                'exp_id': self.exp_id,
                # 'exp_name': self.exp_name,
                'pagos': self.pagos,
                'd_soli': self.d_soli,
                'observacio': self.observacio,
                'loc_provin': self.loc_provin,
                'loc_distri': self.loc_distri,
                'loc_posto': self.loc_posto,
                'loc_nucleo': self.loc_nucleo,
                'loc_endere': self.loc_endere,
                'loc_unidad': self.loc_unidad,
                'loc_bacia': self.loc_bacia,
                'loc_subaci': self.loc_subaci,
                'loc_rio': self.loc_rio,
                'c_soli': self.c_soli,
                'c_licencia': self.c_licencia,
                'c_real': self.c_real,
                'c_estimado': self.c_estimado,
                'actividade': self.actividade,
                # 'utente':     self.utente,
                'area': self.area,
                'fontes': self.fontes,
                'licencias': self.licencias,
                'utente': {}
            },
            'geometry': the_geom
        }
        for column in self.REQUERIMENTO_FIELDS:
            payload['properties'][column] = getattr(self, column)

        if self.utente_rel:
            payload['properties']['utente'] = {
                'id': self.utente_rel.gid,
                'nome': self.utente_rel.nome,
                'uten_tipo': self.utente_rel.uten_tipo,
                'nuit': self.utente_rel.nuit,
                'uten_gere': self.utente_rel.uten_gere,
                'uten_memb': self.utente_rel.uten_memb,
                'uten_mulh': self.utente_rel.uten_mulh,
                'contacto': self.utente_rel.contacto,
                'email': self.utente_rel.email,
                'telefone': self.utente_rel.telefone,
                'loc_provin': self.utente_rel.loc_provin,
                'loc_distri': self.utente_rel.loc_distri,
                'loc_posto': self.utente_rel.loc_posto,
                'loc_nucleo': self.utente_rel.loc_nucleo,
                'reg_comerc': self.utente_rel.reg_comerc,
                'reg_zona': self.utente_rel.reg_zona,
                'observacio': self.utente_rel.observacio
            }
        return payload
