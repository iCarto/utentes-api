# -*- coding: utf-8 -*-

from sqlalchemy import Column, Integer, Numeric, Text
from sqlalchemy import ForeignKey, text

from geoalchemy2 import Geometry

from utentes.lib.schema_validator.validator import Validator
from utentes.models.base import (
    Base,
    PGSQL_SCHEMA_UTENTES,
    update_geom,
    update_area
)
from actividades_schema import ActividadeSchema


class ActividadesCultivos(Base):
    __tablename__ = 'actividades_cultivos'
    __table_args__ = {u'schema': PGSQL_SCHEMA_UTENTES}
    __mapper_args__ = {
        'order_by': 'cult_id'
    }

    gid = Column(
        Integer,
        primary_key=True,
        server_default=text("nextval('utentes.actividades_cultivos_gid_seq'::regclass)"))
    cult_id = Column(Text, nullable=False, unique=True, doc='Id de cultivo')
    actividade = Column(
        ForeignKey(
            u'utentes.actividades_agricultura_rega.gid',
            ondelete=u'CASCADE',
            onupdate=u'CASCADE'),
        nullable=False)
    c_estimado = Column(Numeric(10, 2), nullable=False, doc='Consumo mensal estimado')
    cultivo = Column(Text, nullable=False, doc='Tipo de cultivo')
    rega = Column(Text, nullable=False, doc='Tipo de rega')
    eficiencia = Column(Numeric(10, 2), doc='Eficiencia del riego')
    area = Column(Numeric(10, 4), nullable=False, doc='Área (ha)')
    observacio = Column(Text, doc='Observações')
    the_geom = Column(Geometry('MULTIPOLYGON', '32737'), index=True)

    @staticmethod
    def create_from_json(json):
        cultivo = ActividadesCultivos()
        cultivo.update_from_json(json)
        return cultivo

    def update_from_json(self, json):
        # actividade - handled by sqlalchemy relationship
        self.gid = json.get('id')
        self.cult_id = json.get('cult_id')
        self.c_estimado = json.get('c_estimado')
        self.cultivo = json.get('cultivo')
        self.rega = json.get('rega')
        self.eficiencia = json.get('eficiencia')
        self.area = json.get('area')
        self.observacio = json.get('observacio')
        self.the_geom = update_geom(self.the_geom, json)
        update_area(self, json)

        if json.get('geometry_edited'):
            if self.area is None:
                self.c_estimado = 0
            elif self.rega == 'Regional':
                self.c_estimado = self.area * 10000 / 12
            elif self.eficiencia is None:
                self.c_estimado = 0
            else:
                self.c_estimado = (self.area * 30 * 86400 * 0.21) / (1000 * self.eficiencia)

    def __json__(self, request):
        the_geom = None
        if self.the_geom is not None:
            import json
            the_geom = json.loads(request.db.query(self.the_geom.ST_Transform(4326).ST_AsGeoJSON()).first()[0])

        return {
            'type': 'Feature',
            'properties': {
                'id': self.gid,
                'cult_id': self.cult_id,
                'actividade': self.actividade,
                'c_estimado': self.c_estimado,
                'cultivo': self.cultivo,
                'rega': self.rega,
                'eficiencia': self.eficiencia,
                'area': self.area,
                'observacio': self.observacio,
            },
            'geometry': the_geom

        }

    def validate(self, json):
        validator = Validator(ActividadeSchema['Cultivos'])
        return validator.validate(json)
