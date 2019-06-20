# -*- coding: utf-8 -*-

from geoalchemy2 import Geometry
from geoalchemy2.elements import WKTElement
from sqlalchemy import Boolean, Column, Date, Integer, Numeric, Text, text

from utentes.lib.formatter.formatter import to_date, to_decimal
from utentes.lib.geomet import wkt
from utentes.models.base import PGSQL_SCHEMA_UTENTES, Base


class InventarioFonte(Base):
    __tablename__ = "inventario_fontes"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    gid = Column(
        Integer,
        primary_key=True,
        server_default=text("nextval('utentes.inventario_fontes_gid_seq'::regclass)"),
    )
    fonte = Column(Text)
    cod_fonte = Column(Text, nullable=False, unique=True)
    tip_fonte = Column(Text)
    red_monit = Column(Text)
    entidade = Column(Text)
    tecnico = Column(Text)
    data = Column(Text)
    hora = Column(Text)
    provincia = Column(Text)
    distrito = Column(Text)
    posto_adm = Column(Text)
    nucleo = Column(Text)
    altitude = Column(Numeric(10, 2))
    distancia = Column(Numeric(10, 2))
    propiedad = Column(Text)
    nome_prop = Column(Text)
    telefone = Column(Text)
    escritura = Column(Boolean)
    domestico = Column(Boolean)
    habitant = Column(Integer)
    agricult = Column(Boolean)
    superf = Column(Numeric(10, 2))
    ganaderia = Column(Boolean)
    n_reses = Column(Integer)
    industria = Column(Boolean)
    tip_indus = Column(Text)
    outros = Column(Boolean)
    coment_otr = Column(Text)
    estado_fon = Column(Text)
    tipo_pozo = Column(Text)
    prof_pozo = Column(Numeric(10, 2))
    diametro = Column(Numeric(10, 2))
    alt_brocal = Column(Numeric(10, 2))
    bombeo = Column(Boolean)
    tip_bomba = Column(Text)
    tip_motor = Column(Text)
    marca = Column(Text)
    alt_bomba = Column(Numeric(10, 2))
    caudal = Column(Numeric(10, 2))
    t_bombeo = Column(Integer)
    potencia = Column(Numeric(10, 2))
    estado = Column(Text)
    reperfor = Column(Boolean)
    rep_dista = Column(Numeric(10, 2))
    limpezas = Column(Boolean)
    coment = Column(Text)
    metodo = Column(Text)
    n_limpeza = Column(Integer)
    geom = Column(Geometry("POINT", "32737"), index=True)

    def update_from_json(self, json):
        for c in self.__mapper__.columns:
            name = c.name
            jsonValue = json["properties"].get(name) or json["properties"].get(
                name.upper()
            )
            if name == "geom":
                jsonValue = json["geometry"]

            if jsonValue is None:
                continue

            if isinstance(c.type, Numeric):
                value = to_decimal(jsonValue)
            elif isinstance(c.type, Date):
                value = to_date(jsonValue)
            elif isinstance(c.type, Geometry):
                value = WKTElement(wkt.dumps(jsonValue), srid=4326)
                value = value.ST_Transform(32737)
            else:
                value = jsonValue
            setattr(self, name, value)

    @staticmethod
    def create_from_json(body):
        e = InventarioFonte()
        e.update_from_json(body)
        return e

    def __json__(self, request):
        geom = None
        if self.geom is not None:
            import json

            geom = json.loads(
                request.db.query(self.geom.ST_Transform(4326).ST_AsGeoJSON()).first()[0]
            )
        return {
            "type": "Feature",
            "properties": {"red_monit": self.red_monit},
            "geometry": geom,
        }
