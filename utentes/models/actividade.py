# -*- coding: utf-8 -*-

from sqlalchemy import Boolean, Column, Integer, Numeric, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import ForeignKey, text
from sqlalchemy.orm import relationship

from utentes.models.base import (
    Base,
    PGSQL_SCHEMA_UTENTES,
    update_array,
)
from utentes.lib.schema_validator.validator import Validator
import actividades_schema
from utentes.models.reses import ActividadesReses
from utentes.models.cultivo import ActividadesCultivos
from utentes.models.tanques_piscicolas import ActividadesTanquesPiscicolas
from functools import reduce


class Actividade(Base):
    __tablename__ = 'actividades'
    __table_args__ = {u'schema': PGSQL_SCHEMA_UTENTES}

    gid = Column(Integer, primary_key=True, server_default=text("nextval('utentes.actividades_gid_seq'::regclass)"))
    exploracao = Column(
        ForeignKey(
            u'utentes.exploracaos.gid',
            ondelete=u'CASCADE',
            onupdate=u'CASCADE'),
        nullable=False)
    # when updating tipo value, or other ForeignKey with tables not defined in the mapper
    # an exception is raised. Probably removing onupdate will work
    # tipo = Column(ForeignKey(u'domains.actividade.key', onupdate=u'CASCADE'), nullable=False)
    tipo = Column(Text, nullable=False, doc='Tipo de actividade')

    __mapper_args__ = {
        'polymorphic_identity': 'actividades',
        'polymorphic_on': tipo
    }

    # def validate(self, json):
    #     validator_name = self.__class__.__name__ + '_SCHEMA'
    #     validator = Validator(actividades_schema.validator_name)
    #     return validator.validate(json)

    @staticmethod
    def create_from_json(json):
        classes = {
            u'Abastecimento': ActividadesAbastecemento,
            u'Agricultura de Regadio': ActividadesAgriculturaRega,
            u'Indústria': ActividadesIndustria,
            u'Pecuária': ActividadesPecuaria,
            u'Piscicultura': ActividadesPiscicultura,
            u'Producção de energia': ActividadesProduccaoEnergia,
            u'Saneamento': ActividadesSaneamento,
        }
        tipo = json.get('tipo')
        a = classes[tipo]()
        a.update_from_json(json)
        return a

    def next_child_id(self, childs, id_name):
        """For activities that have childs like cultivos, reses, tanques"""
        id_sequence = [int(getattr(seq, id_name).split('/')[3]) for seq in childs if getattr(seq, id_name)]
        if len(id_sequence) == 0:
            return 1
        else:
            return max(id_sequence) + 1

    def __json__(self, request):
        json = {c: getattr(self, c) for c in self.__mapper__.columns.keys()}
        del json['gid']
        json['id'] = self.gid
        return json


class ActividadesAbastecemento(Actividade):
    __tablename__ = 'actividades_abastecemento'
    __table_args__ = {u'schema': PGSQL_SCHEMA_UTENTES}

    gid = Column(ForeignKey(u'utentes.actividades.gid', ondelete=u'CASCADE', onupdate=u'CASCADE'), primary_key=True)
    c_estimado = Column(Numeric(10, 2), doc='Consumo mensal estimado')
    habitantes = Column(Integer, doc='Número de habitantes (Utilizadores)')  # , server_default=text("20"))
    dotacao = Column(Integer, doc='Dotação (l/pessoa/dia)')

    __mapper_args__ = {
        'polymorphic_identity': u'Abastecimento',
    }

    def update_from_json(self, json):
        self.gid = json.get('id')
        self.tipo = json.get('tipo')
        self.c_estimado = json.get('c_estimado')
        self.habitantes = json.get('habitantes')
        self.dotacao = json.get('dotacao')

    def validate(self, json):
        validator = Validator(actividades_schema.ActividadeSchema['Abastecimento'])
        return validator.validate(json)


class ActividadesAgriculturaRega(Actividade):
    __tablename__ = 'actividades_agricultura_rega'
    __table_args__ = {u'schema': PGSQL_SCHEMA_UTENTES}

    gid = Column(ForeignKey(u'utentes.actividades.gid', ondelete=u'CASCADE', onupdate=u'CASCADE'), primary_key=True)
    c_estimado = Column(Numeric(10, 2), doc='Consumo mensal estimado')
    n_cul_tot = Column(Integer, doc='Número de cultivos')
    area_pot = Column(Numeric(10, 4), doc='Área potencial')
    area_irri = Column(Numeric(10, 4), doc='Área Irrigada')
    area_medi = Column(Numeric(10, 4), doc='Área medida')

    __mapper_args__ = {
        'polymorphic_identity': u'Agricultura de Regadio',
    }

    cultivos = relationship('ActividadesCultivos',
                            cascade='all, delete-orphan',
                            order_by='ActividadesCultivos.gid',
                            passive_deletes=True)

    def __json__(self, request):
        json = {c: getattr(self, c) for c in self.__mapper__.columns.keys()}
        del json['gid']
        json['id'] = self.gid
        json['cultivos'] = {
            'type': 'FeatureCollection',
            'features': self.cultivos
        }
        return json

    def update_from_json(self, json):
        self.gid = json.get('id')
        self.tipo = json.get('tipo')
        next_cult_id = self.next_child_id(self.cultivos, 'cult_id')
        update_array(self.cultivos,
                     json.get('cultivos'),
                     ActividadesCultivos.create_from_json)
        for cultivo in self.cultivos:
            if not cultivo.cult_id:
                cultivo.cult_id = json.get('exp_id') + '/{:03d}'.format(next_cult_id)
                next_cult_id += 1

        # self.c_estimado = json.get('c_estimado')
        self.c_estimado = reduce(lambda x, y: x + y.c_estimado, self.cultivos, 0)
        self.n_cul_tot = json.get('n_cul_tot')
        self.area_pot = json.get('area_pot')
        self.area_irri = json.get('area_irri')
        self.area_medi = json.get('area_medi')

    def validate(self, json):
        validator = Validator(actividades_schema.ActividadeSchema['Agricultura de Regadio'])
        return validator.validate(json)


class ActividadesIndustria(Actividade):
    __tablename__ = 'actividades_industria'
    __table_args__ = {u'schema': PGSQL_SCHEMA_UTENTES}

    gid = Column(ForeignKey(u'utentes.actividades.gid', ondelete=u'CASCADE', onupdate=u'CASCADE'), primary_key=True)
    c_estimado = Column(Numeric(10, 2), doc='Consumo mensal estimado')
    # tipo_indus = Column(ForeignKey(u'domains.industria_tipo.key', onupdate=u'CASCADE'))
    tipo_indus = Column(Text, doc='Tipo de indústria')
    instalacio = Column(Text, doc='Instalações')
    efluente = Column(Text, doc='Efluente producido')
    tratamento = Column(Text, doc='Medios tratamento água')
    eval_impac = Column(Boolean, doc='Evaluação Impacto Ambiental')

    __mapper_args__ = {
        'polymorphic_identity': u'Indústria',
    }

    def update_from_json(self, json):
        self.gid = json.get('id')
        self.tipo = json.get('tipo')
        self.c_estimado = json.get('c_estimado')
        self.tipo_indus = json.get('tipo_indus')
        self.instalacio = json.get('instalacio')
        self.efluente = json.get('efluente')
        self.tratamento = json.get('tratamento')
        self.eval_impac = json.get('eval_impac')

    def validate(self, json):
        validator = Validator(actividades_schema.ActividadeSchema['Indústria'])
        return validator.validate(json)


class ActividadesPecuaria(Actividade):
    __tablename__ = 'actividades_pecuaria'
    __table_args__ = {u'schema': PGSQL_SCHEMA_UTENTES}

    gid = Column(ForeignKey(u'utentes.actividades.gid', ondelete=u'CASCADE', onupdate=u'CASCADE'), primary_key=True)
    c_estimado = Column(Numeric(10, 2), doc='Consumo mensal estimado')
    n_res_tot = Column(Integer, doc='Nro de reses total')

    __mapper_args__ = {
        'polymorphic_identity': u'Pecuária',
    }

    reses = relationship('ActividadesReses',
                         cascade='all, delete-orphan',
                         order_by='ActividadesReses.gid',
                         passive_deletes=True)

    def __json__(self, request):
        json = {c: getattr(self, c) for c in self.__mapper__.columns.keys()}
        del json['gid']
        json['id'] = self.gid
        json['reses'] = self.reses
        return json

    def update_from_json(self, json):
        self.gid = json.get('id')
        self.tipo = json.get('tipo')
        self.c_estimado = json.get('c_estimado')
        self.n_res_tot = json.get('n_res_tot')
        update_array(self.reses,
                     json.get('reses'),
                     ActividadesReses.create_from_json)

    def validate(self, json):
        validator = Validator(actividades_schema.ActividadeSchema['Pecuária'])
        return validator.validate(json)


class ActividadesPiscicultura(Actividade):
    __tablename__ = 'actividades_piscicultura'
    __table_args__ = {u'schema': PGSQL_SCHEMA_UTENTES}

    gid = Column(ForeignKey(u'utentes.actividades.gid', ondelete=u'CASCADE', onupdate=u'CASCADE'), primary_key=True)
    c_estimado = Column(Numeric(10, 2), doc='Consumo mensal estimado')
    area = Column(Numeric(10, 4), doc='Área de exploração (ha)')
    ano_i_ati = Column(Integer, doc='Ano inicio da atividade')
    n_tanques = Column(Integer, doc='Nro de tanques')
    tipo_agua = Column(Text, doc='Tipo de aquacultura')
    v_reservas = Column(Numeric(10, 2), doc='Volume total tanques/gaiolas (reservas)')
    n_ale_pov = Column(Integer, doc='Nro de alevins por povoar')
    produc_pi = Column(Numeric(10, 2), doc='Produção Anual (kg)')
    tipo_proc = Column(Text, doc='Processamento do peixe')
    asis_aber = Column(Text, doc='Durante a abertura dos tanques/gaiolas')
    asis_moni = Column(Text, doc='Na monitoria dos tanques/gaiolas')
    asis_orig = Column(ARRAY(Text), doc='Origem da assistência')
    asis_or_o = Column(Text, doc='Outros')
    trat_t_en = Column(Text, doc='Tratamento da água que entra nos tanques')
    trat_a_sa = Column(Text, doc='Tratamento da água que sai dos tanques')
    gaio_subm = Column(Text, doc='As gaiolas estão submersas em')
    problemas = Column(Text, doc='A exploraçaõ tem problemas')
    prob_prin = Column(Text, doc='Principais problemas')
    esp_culti = Column(Text, nullable=False, doc='Espécie cultivada')

    __mapper_args__ = {
        'polymorphic_identity': u'Piscicultura',
    }

    tanques_piscicolas = relationship('ActividadesTanquesPiscicolas',
                                      cascade='all, delete-orphan',
                                      order_by='ActividadesTanquesPiscicolas.gid',
                                      passive_deletes=True)

    def __json__(self, request):
        json = {c: getattr(self, c) for c in self.__mapper__.columns.keys()}
        del json['gid']
        json['id'] = self.gid
        json['tanques_piscicolas'] = {
            'type': 'FeatureCollection',
            'features': self.tanques_piscicolas
        }
        return json

    def update_from_json(self, json, area_exp=None):
        # actividade - handled by sqlalchemy relationship
        SPECIAL_CASES = ['gid', 'tanques_piscicolas']
        self.gid = json.get('id')
        next_tanque_id = self.next_child_id(self.tanques_piscicolas, 'tanque_id')
        update_array(self.tanques_piscicolas,
                     json.get('tanques_piscicolas'),
                     ActividadesTanquesPiscicolas.create_from_json)
        for tanque in self.tanques_piscicolas:
            if not tanque.tanque_id:
                tanque.tanque_id = json.get('exp_id') + '/{:03d}'.format(next_tanque_id)
                next_tanque_id += 1

        for column in self.__mapper__.columns.keys():
            if column in SPECIAL_CASES:
                continue
            setattr(self, column, json.get(column))
        if json.get('area_exploracao_for_calcs') is not None:
            self.area = json.get('area_exploracao_for_calcs')

    def validate(self, json):
        validator = Validator(actividades_schema.ActividadeSchema['Piscicultura'])
        return validator.validate(json)


class ActividadesProduccaoEnergia(Actividade):
    __tablename__ = 'actividades_produccao_energia'
    __table_args__ = {u'schema': PGSQL_SCHEMA_UTENTES}

    gid = Column(ForeignKey(u'utentes.actividades.gid', ondelete=u'CASCADE', onupdate=u'CASCADE'), primary_key=True)
    c_estimado = Column(Numeric(10, 2), doc='Consumo mensal estimado')
    # energia_tipo = Column(ForeignKey(u'domains.energia_tipo.key', onupdate=u'CASCADE'))
    energia_tipo = Column(Text, doc='Tipo de produção')
    alt_agua = Column(Numeric(10, 2), doc='Altura de água')
    potencia = Column(Numeric(10, 2), doc='Potência a instalar')
    equipo = Column(Text, doc='Tipo de equipamento')
    eval_impac = Column(Boolean, doc='Evaluação Impacto Ambiental')

    __mapper_args__ = {
        'polymorphic_identity': u'Producção de energia',
    }

    def update_from_json(self, json):
        self.gid = json.get('id')
        self.tipo = json.get('tipo')
        self.c_estimado = json.get('c_estimado')
        self.energia_tipo = json.get('energia_tipo')
        self.alt_agua = json.get('alt_agua')
        self.potencia = json.get('potencia')
        self.equipo = json.get('equipo')
        self.eval_impac = json.get('eval_impac')

    def validate(self, json):
        validator = Validator(actividades_schema.ActividadeSchema['Producção de energia'])
        return validator.validate(json)


class ActividadesSaneamento(Actividade):
    __tablename__ = 'actividades_saneamento'
    __table_args__ = {u'schema': PGSQL_SCHEMA_UTENTES}

    gid = Column(ForeignKey(u'utentes.actividades.gid', ondelete=u'CASCADE', onupdate=u'CASCADE'), primary_key=True)
    c_estimado = Column(Numeric(10, 2), doc='Consumo mensal estimado')
    habitantes = Column(Integer, doc='Nro de habitantes (Utilizadores)')

    __mapper_args__ = {
        'polymorphic_identity': u'Saneamento',
    }

    def update_from_json(self, json):
        self.gid = json.get('id')
        self.tipo = json.get('tipo')
        self.c_estimado = json.get('c_estimado')
        self.habitantes = json.get('habitantes')

    def validate(self, json):
        validator = Validator(actividades_schema.ActividadeSchema['Saneamento'])
        return validator.validate(json)
