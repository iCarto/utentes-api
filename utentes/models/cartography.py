from geoalchemy2 import Geometry
from sqlalchemy import Column, Integer, Text, func
from sqlalchemy.orm import column_property

from utentes.models.base import (
    PGSQL_SCHEMA_CBASE,
    PGSQL_SCHEMA_CBASE_ARA,
    PGSQL_SCHEMA_INVENTARIO,
    Base,
)


class CartographyBase(Base):
    __abstract__ = True

    gid = Column(Integer, primary_key=True)

    def __json__(self, request):
        properties = {
            c: getattr(self, c)
            for c in self.__mapper__.columns.keys()
            if c not in ("gid", "geom", "geom_as_geojson")
        }
        geom = None
        if self.geom is not None:
            import json

            geom = json.loads(self.geom_as_geojson)
        return {"type": "Feature", "properties": properties, "geometry": geom}


class Estacoes(CartographyBase):
    __tablename__ = "estacoes"
    __table_args__ = {"schema": PGSQL_SCHEMA_INVENTARIO}

    cod_estac = Column(Text)
    tip_estac = Column(Text)
    geom = Column(Geometry("POINT", "32737"), index=True)
    geom_as_geojson = column_property(
        func.coalesce(func.ST_AsGeoJSON(func.ST_Transform(geom, 4326), 6), None)
    )


class Barragens(CartographyBase):
    __tablename__ = "barragens"
    __table_args__ = {"schema": PGSQL_SCHEMA_INVENTARIO}

    tip_barra = Column(Text)
    geom = Column(Geometry("POINT", "32737"), index=True)
    geom_as_geojson = column_property(
        func.coalesce(func.ST_AsGeoJSON(func.ST_Transform(geom, 4326), 6), None)
    )


class Fontes(CartographyBase):
    __tablename__ = "fontes"
    __table_args__ = {"schema": PGSQL_SCHEMA_INVENTARIO}

    red_monit = Column(Text)
    geom = Column(Geometry("POINT", "32737"), index=True)
    geom_as_geojson = column_property(
        func.coalesce(func.ST_AsGeoJSON(func.ST_Transform(geom, 4326), 6), None)
    )


class EntidadesPopulacao(CartographyBase):
    __tablename__ = "entidades_populacao"
    __table_args__ = {"schema": PGSQL_SCHEMA_CBASE_ARA}

    nome = Column(Text)
    geom = Column(Geometry("MULTIPOLYGON", "32737"), index=True)
    geom_as_geojson = column_property(
        func.coalesce(func.ST_AsGeoJSON(func.ST_Transform(geom, 4326), 6), None)
    )


class Albufeiras(CartographyBase):
    __tablename__ = "albufeiras"
    __table_args__ = {"schema": PGSQL_SCHEMA_CBASE_ARA}

    geom = Column(Geometry("MULTIPOLYGON", "32737"), index=True)
    geom_as_geojson = column_property(
        func.coalesce(func.ST_AsGeoJSON(func.ST_Transform(geom, 4326), 6), None)
    )


class Lagos(CartographyBase):
    __tablename__ = "lagos"
    __table_args__ = {"schema": PGSQL_SCHEMA_CBASE_ARA}

    geom = Column(Geometry("MULTIPOLYGON", "32737"), index=True)
    geom_as_geojson = column_property(
        func.coalesce(func.ST_AsGeoJSON(func.ST_Transform(geom, 4326), 6), None)
    )


class Estradas(CartographyBase):
    __tablename__ = "estradas"
    __table_args__ = {"schema": PGSQL_SCHEMA_CBASE_ARA}

    tipo = Column(Text)
    geom = Column(Geometry("MULTIPOLYGON", "32737"), index=True)
    geom_as_geojson = column_property(
        func.coalesce(
            func.ST_AsGeoJSON(func.ST_Transform(func.ST_Simplify(geom, 10), 4326), 6),
            None,
        )
    )


class Rios(CartographyBase):
    __tablename__ = "rios"
    __table_args__ = {"schema": PGSQL_SCHEMA_CBASE_ARA}

    geom = Column(Geometry("MULTIPOLYGON", "32737"), index=True)
    geom_as_geojson = column_property(
        func.coalesce(
            func.ST_AsGeoJSON(func.ST_Transform(func.ST_Simplify(geom, 10), 4326), 6),
            None,
        )
    )


class ARAS(CartographyBase):
    __tablename__ = "aras"
    __table_args__ = {"schema": PGSQL_SCHEMA_CBASE}

    nome = Column(Text)
    geom = Column(Geometry("MULTIPOLYGON", "32737"), index=True)
    geom_as_geojson = column_property(
        func.coalesce(
            func.ST_AsGeoJSON(func.ST_Transform(func.ST_Simplify(geom, 50), 4326), 6),
            None,
        )
    )


class Bacias(CartographyBase):
    __tablename__ = "bacias"
    __table_args__ = {"schema": PGSQL_SCHEMA_CBASE_ARA}

    nome = Column(Text)
    geom = Column(Geometry("MULTIPOLYGON", "32737"), index=True)
    geom_as_geojson = column_property(
        func.coalesce(
            func.ST_AsGeoJSON(func.ST_Transform(func.ST_Simplify(geom, 10), 4326), 6),
            None,
        )
    )


class BaciasRepresentacion(CartographyBase):
    __tablename__ = "bacias_representacion"
    __table_args__ = {"schema": PGSQL_SCHEMA_CBASE_ARA}

    nome = Column(Text)
    geom = Column(Geometry("MULTIPOLYGON", "32737"), index=True)
    geom_as_geojson = column_property(
        func.coalesce(
            func.ST_AsGeoJSON(func.ST_Transform(func.ST_Simplify(geom, 10), 4326), 6),
            None,
        )
    )


class Provincias(CartographyBase):
    __tablename__ = "provincias"
    __table_args__ = {"schema": PGSQL_SCHEMA_CBASE}

    geom = Column(Geometry("MULTIPOLYGON", "32737"), index=True)
    geom_as_geojson = column_property(
        func.coalesce(
            func.ST_AsGeoJSON(func.ST_Transform(func.ST_Simplify(geom, 50), 4326), 6),
            None,
        )
    )


class Paises(CartographyBase):
    __tablename__ = "paises_limitrofes"
    __table_args__ = {"schema": PGSQL_SCHEMA_CBASE_ARA}

    nome = Column(Text)
    geom = Column(Geometry("MULTIPOLYGON", "32737"), index=True)
    geom_as_geojson = column_property(
        func.coalesce(
            func.ST_AsGeoJSON(func.ST_Transform(func.ST_Simplify(geom, 50), 4326), 3),
            None,
        )
    )


class Oceanos(CartographyBase):
    __tablename__ = "oceanos"
    __table_args__ = {"schema": PGSQL_SCHEMA_CBASE_ARA}

    geom = Column(Geometry("MULTIPOLYGON", "32737"), index=True)
    geom_as_geojson = column_property(
        func.coalesce(func.ST_AsGeoJSON(func.ST_Transform(geom, 4326), 3), None)
    )
