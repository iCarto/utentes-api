from geoalchemy2 import Geometry
from sqlalchemy import Column, ForeignKey, Integer, Numeric, Text, func, text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import column_property

from utentes.lib.schema_validator.validator import Validator
from utentes.models.base import PGSQL_SCHEMA_UTENTES, Base, update_area, update_geom

from .actividades_schema import ActividadeSchema


class ActividadesTanquesPiscicolas(Base):
    __tablename__ = "actividades_tanques_piscicolas"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    gid = Column(
        Integer,
        primary_key=True,
        server_default=text(
            "nextval('utentes.actividades_tanques_piscicolas_gid_seq'::regclass)"
        ),
    )
    tanque_id = Column(Text, nullable=False, unique=True, doc="Id de Tanque")
    actividade = Column(
        ForeignKey(
            "utentes.actividades_piscicultura.gid",
            ondelete="CASCADE",
            onupdate="CASCADE",
        ),
        nullable=False,
    )
    # TODO. Use 'comment' instead of doc when upgrading to sqlalchemy 1.2
    # http://docs.sqlalchemy.org/en/latest/core/metadata.html#sqlalchemy.schema.Column.params.comment
    tipo = Column(Text, nullable=False, doc="Tipo")
    cumprimen = Column(Numeric(10, 2), doc="Comprimento (m)")
    largura = Column(Numeric(10, 2), doc="Largura (m)")
    profundid = Column(Numeric(10, 2), doc="Profundidade (m)")
    area = Column(Numeric(10, 4), doc="Área (m2)")
    area_gps = Column(Numeric(10, 4), doc="Área GPS (m2)")
    volume = Column(Numeric(10, 4), doc="Volume (m3)")
    estado = Column(Text, doc="Estado")
    esp_culti = Column(Text, nullable=False, doc="Espécie cultivada")
    esp_cul_o = Column(Text, doc="Espécie cultivada (outros)")
    tipo_alim = Column(ARRAY(Text), doc="Tipo de alimentação")
    tipo_al_o = Column(Text, doc="Tipo de alimenção (outros)")
    n_ale_pov = Column(Integer, doc="Nro de alevins por povoar")
    prov_alev = Column(Text, doc="Proveniência dos alevinos")
    prov_al_o = Column(Text, doc="Proveniência dos alevinos (outros)")
    venda = Column(Numeric(10, 2), doc="Venda (Kg)")
    consumo = Column(Numeric(10, 2), doc="Consumo (Kg)")
    pro_anual = Column(Numeric(10, 2), doc="Produção anual (Kg)")
    peso_med = Column(Numeric(10, 2), doc="Peso médio final dos peixes (g)")
    fert_agua = Column(Text, doc="Fertilização da água")
    fert_a_o = Column(Text, doc="Fertilização da água (outros)")
    observacio = Column(Text, doc="Observações")
    the_geom = Column(Geometry("MULTIPOLYGON", "32737"), index=True)
    geom_as_geojson = column_property(
        func.coalesce(func.ST_AsGeoJSON(func.ST_Transform(the_geom, 4326)), None)
    )

    @staticmethod
    def create_from_json(json):
        tanque = ActividadesTanquesPiscicolas()
        tanque.update_from_json(json)
        return tanque

    def update_from_json(self, json):
        # actividade - handled by sqlalchemy relationship
        SPECIAL_CASES = ["gid", "the_geom"]
        self.gid = json.get("id")
        self.the_geom = update_geom(self.the_geom, json)
        for column in list(self.__mapper__.columns.keys()):
            if column in SPECIAL_CASES:
                continue
            setattr(self, column, json.get(column))
        update_area(self, json, 1, "area_gps")

    def __json__(self, request):
        SPECIAL_CASES = ["gid", "the_geom"]
        the_geom = None
        if self.the_geom is not None:
            import json

            the_geom = json.loads(self.geom_as_geojson)

        payload = {
            "type": "Feature",
            "properties": {"id": self.gid},
            "geometry": the_geom,
        }
        for column in list(self.__mapper__.columns.keys()):
            if column in SPECIAL_CASES:
                continue
            payload["properties"][column] = getattr(self, column)

        return payload

    def validate(self, json):
        validator = Validator(ActividadeSchema["TanquesPiscicolas"])
        return validator.validate(json)
