from geoalchemy2 import Geometry
from geoalchemy2.functions import GenericFunction
from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    Text,
    text,
)
from sqlalchemy.dialects.postgresql.json import JSONB
from sqlalchemy.orm import relationship

from utentes.lib.formatter.formatter import to_date, to_decimal
from utentes.lib.schema_validator.validation_exception import ValidationException
from utentes.models.base import (
    PGSQL_SCHEMA_UTENTES,
    Base,
    update_area,
    update_array,
    update_geom,
)
from utentes.models.exploracao import ExploracaoConFacturacao
from utentes.models.renovacao import Renovacao


class ExpConRenovacao(ExploracaoConFacturacao):

    renovacao = relationship(
        "Renovacao",
        cascade="all, delete-orphan",
        # primaryjoin="ExpConRenovacao.gid == Renovacao.exploracao",
        lazy="joined",
        passive_deletes=True,
    )

    def update_from_json_renovacao(self, json):
        self.exploracao = json.get("id")
        renovacao = json.get("renovacao")
        for column in set(Renovacao.__mapper__.columns.keys()) - {"gid"}:
            setattr(self, column, renovacao.get(column))

    def __json__(self, request):
        the_geom = None
        if self.the_geom is not None:
            import json

            the_geom = json.loads(self.the_geom_as_geojson)

        renovacao = self.renovacao or {}
        properties = {}

        properties = {c: getattr(self, c) for c in list(self.__mapper__.columns.keys())}
        del properties["the_geom"]
        del properties["gid"]
        properties["id"] = self.gid
        properties["licencias"] = [l.__json__(request) for l in self.licencias]
        properties["actividade"] = self.actividade
        properties["fontes"] = self.fontes
        properties["facturacao"] = [f.__json__(request) for f in self.facturacao]

        properties["renovacao"] = []
        if renovacao:
            for idx, val in enumerate(renovacao):
                properties["renovacao"].append(renovacao[idx].__json__(request))

        if self.utente_rel:
            properties["utente"] = {
                "nome": self.utente_rel.nome,
                "uten_tipo": self.utente_rel.uten_tipo,
                "nuit": self.utente_rel.nuit,
                "uten_gere": self.utente_rel.uten_gere,
                "uten_memb": self.utente_rel.uten_memb,
                "uten_mulh": self.utente_rel.uten_mulh,
                "contacto": self.utente_rel.contacto,
                "email": self.utente_rel.email,
                "telefone": self.utente_rel.telefone,
                "loc_provin": self.utente_rel.loc_provin,
                "loc_distri": self.utente_rel.loc_distri,
                "loc_posto": self.utente_rel.loc_posto,
                "loc_nucleo": self.utente_rel.loc_nucleo,
                "loc_endere": self.utente_rel.loc_endere,
                "reg_comerc": self.utente_rel.reg_comerc,
                "reg_zona": self.utente_rel.reg_zona,
            }

        return {"type": "Feature", "properties": properties, "geometry": the_geom}
