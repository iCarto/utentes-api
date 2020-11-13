from functools import reduce

from sqlalchemy import Boolean, Column, ForeignKey, Integer, Numeric, Text, text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

import utentes.models.constants as c
from utentes.lib.schema_validator.validator import Validator
from utentes.models.base import PGSQL_SCHEMA_UTENTES, Base, update_array
from utentes.models.cultivo import ActividadesCultivos
from utentes.models.reses import ActividadesReses
from utentes.models.tanques_piscicolas import ActividadesTanquesPiscicolas
from utentes.services import id_service

from . import actividades_schema


class ActividadeBase(Base):
    __tablename__ = "actividades"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    gid = Column(
        Integer,
        primary_key=True,
        server_default=text("nextval('utentes.actividades_gid_seq'::regclass)"),
    )
    exploracao = Column(
        ForeignKey("utentes.exploracaos.gid", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
    # when updating tipo value, or other ForeignKey with tables not defined in the mapper
    # an exception is raised. Probably removing onupdate will work
    # tipo = Column(ForeignKey(u'domains.actividade.key', onupdate=u'CASCADE'), nullable=False)
    tipo = Column(Text, nullable=False, doc="Tipo de actividade")
    c_estimado = Column(Numeric(10, 2), doc="Consumo mensal estimado")

    # def validate(self, json):
    #     validator_name = self.__class__.__name__ + '_SCHEMA'
    #     validator = Validator(actividades_schema.validator_name)
    #     return validator.validate(json)

    @staticmethod
    def create_from_json(json):
        classes = {
            c.K_ABASTECIMENTO: ActividadesAbastecemento,
            c.K_AGRICULTURA: ActividadesAgriculturaRega,
            c.K_INDUSTRIA: ActividadesIndustria,
            c.K_PECUARIA: ActividadesPecuaria,
            c.K_PISCICULTURA: ActividadesPiscicultura,
            c.K_ENERGIA: ActividadesProduccaoEnergia,
            c.K_SANEAMENTO: ActividadesSaneamento,
        }
        tipo = json.get("tipo")
        a = classes[tipo]()
        a.update_from_json(json)
        return a

    def __json__(self, request):
        json = {c: getattr(self, c) for c in list(self.__mapper__.columns.keys())}
        del json["gid"]
        json["id"] = self.gid
        return json


class Actividade(ActividadeBase):
    __mapper_args__ = {
        "polymorphic_identity": "actividades",
        "polymorphic_on": ActividadeBase.tipo,
        "with_polymorphic": "*",
    }


class ActividadesAbastecemento(Actividade):
    __tablename__ = "actividades_abastecemento"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    gid = Column(
        ForeignKey("utentes.actividades.gid", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )
    habitantes = Column(
        Integer, doc="Número de habitantes (Utilizadores)"
    )  # , server_default=text("20"))
    dotacao = Column(Integer, doc="Dotação (l/pessoa/dia)")

    __mapper_args__ = {"polymorphic_identity": c.K_ABASTECIMENTO}

    def update_from_json(self, json):
        self.gid = json.get("id")
        self.tipo = json.get("tipo")
        self.c_estimado = json.get("c_estimado")
        self.habitantes = json.get("habitantes")
        self.dotacao = json.get("dotacao")

    def validate(self, json):
        validator = Validator(actividades_schema.ActividadeSchema[c.K_ABASTECIMENTO])
        return validator.validate(json)


class ActividadesAgriculturaRega(Actividade):
    __tablename__ = "actividades_agricultura_rega"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    gid = Column(
        ForeignKey("utentes.actividades.gid", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )
    n_cul_tot = Column(Integer, doc="Número de culturas")
    area_pot = Column(Numeric(10, 4), doc="Área potencial")
    area_irri = Column(Numeric(10, 4), doc="Área irrigada")
    area_medi = Column(Numeric(10, 4), doc="Área medida")

    __mapper_args__ = {"polymorphic_identity": c.K_AGRICULTURA}

    cultivos = relationship(
        "ActividadesCultivos",
        cascade="all, delete-orphan",
        order_by="ActividadesCultivos.cult_id",
        lazy="joined",
        passive_deletes=True,
    )

    def __json__(self, request):
        json = {c: getattr(self, c) for c in list(self.__mapper__.columns.keys())}
        del json["gid"]
        json["id"] = self.gid
        json["cultivos"] = {"type": "FeatureCollection", "features": self.cultivos}
        return json

    def update_from_json(self, json):
        self.gid = json.get("id")
        self.tipo = json.get("tipo")
        update_array(
            self.cultivos, json.get("cultivos"), ActividadesCultivos.create_from_json
        )
        for cultivo in self.cultivos:
            if not cultivo.cult_id:
                cultivo.cult_id = id_service.calculate_new_child_id(
                    self.cultivos, "cult_id", json.get("exp_id")
                )

        # self.c_estimado = json.get('c_estimado')
        self.c_estimado = reduce(lambda x, y: x + y.c_estimado, self.cultivos, 0)
        self.n_cul_tot = json.get("n_cul_tot")
        self.area_pot = json.get("area_pot")
        self.area_irri = json.get("area_irri")
        self.area_medi = json.get("area_medi")

    def validate(self, json):
        validator = Validator(actividades_schema.ActividadeSchema[c.K_AGRICULTURA])
        return validator.validate(json)


class ActividadesIndustria(Actividade):
    __tablename__ = "actividades_industria"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    gid = Column(
        ForeignKey("utentes.actividades.gid", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )
    # tipo_indus = Column(ForeignKey(u'domains.industria_tipo.key', onupdate=u'CASCADE'))
    tipo_indus = Column(Text, doc="Tipo de indústria")
    instalacio = Column(Text, doc="Instalações")
    efluente = Column(Text, doc="Efluente produzido")
    tratamento = Column(Text, doc="Méios de tratamento da água")
    eval_impac = Column(Boolean, doc="Evaluação de Impacto Ambiental")

    __mapper_args__ = {"polymorphic_identity": c.K_INDUSTRIA}

    def update_from_json(self, json):
        self.gid = json.get("id")
        self.tipo = json.get("tipo")
        self.c_estimado = json.get("c_estimado")
        self.tipo_indus = json.get("tipo_indus")
        self.instalacio = json.get("instalacio")
        self.efluente = json.get("efluente")
        self.tratamento = json.get("tratamento")
        self.eval_impac = json.get("eval_impac")

    def validate(self, json):
        validator = Validator(actividades_schema.ActividadeSchema[c.K_INDUSTRIA])
        return validator.validate(json)


class ActividadesPecuaria(Actividade):
    __tablename__ = "actividades_pecuaria"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    gid = Column(
        ForeignKey("utentes.actividades.gid", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )
    n_res_tot = Column(Integer, doc="Número de reses total")

    __mapper_args__ = {"polymorphic_identity": c.K_PECUARIA}

    reses = relationship(
        "ActividadesReses",
        cascade="all, delete-orphan",
        order_by="ActividadesReses.gid",
        lazy="joined",
        passive_deletes=True,
    )

    def __json__(self, request):
        json = {c: getattr(self, c) for c in list(self.__mapper__.columns.keys())}
        del json["gid"]
        json["id"] = self.gid
        json["reses"] = self.reses
        return json

    def update_from_json(self, json):
        self.gid = json.get("id")
        self.tipo = json.get("tipo")
        self.c_estimado = json.get("c_estimado")
        self.n_res_tot = json.get("n_res_tot")
        update_array(self.reses, json.get("reses"), ActividadesReses.create_from_json)

    def validate(self, json):
        validator = Validator(actividades_schema.ActividadeSchema[c.K_PECUARIA])
        return validator.validate(json)


class ActividadesPiscicultura(Actividade):
    __tablename__ = "actividades_piscicultura"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    gid = Column(
        ForeignKey("utentes.actividades.gid", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )
    area = Column(Numeric(10, 4), doc="Área de exploração (ha)")
    ano_i_ati = Column(Integer, doc="Ano de inicio da actividade")
    tipo_aqua = Column(Text, doc="Tipo de aquacultura")
    esp_culti = Column(ARRAY(Text), nullable=False, doc="Espécies cultivadas")
    n_tanques = Column(Integer, doc="Número de tanques")
    v_reservas = Column(Numeric(10, 2), doc="Volume total dos tanques/gaiolas (reservas)")
    prov_alev = Column(ARRAY(Text), nullable=False, doc="Proveniência dos alevinos")
    n_ale_pov = Column(Integer, doc="Número de alevins por povoar")
    produc_pi = Column(Numeric(10, 2), doc="Producção anual (Kg)")
    tipo_proc = Column(Text, doc="Processamento do peixe")
    asis_aber = Column(Text, doc="Durante a abertura dos tanques/gaiolas")
    asis_moni = Column(Text, doc="Na monitoria dos tanques/gaiolas")
    asis_orig = Column(ARRAY(Text), doc="Origem da assistência")
    asis_or_o = Column(Text, doc="Outros")
    trat_t_en = Column(Text, doc="Tratamento da água que entra nos tanques")
    trat_a_sa = Column(Text, doc="Tratamento da água que sai dos tanques")
    gaio_subm = Column(Text, doc="As gaiolas estão submersas em")
    problemas = Column(Text, doc="A exploraçaõ tem problemas")
    prob_prin = Column(Text, doc="Principais problemas")

    __mapper_args__ = {"polymorphic_identity": c.K_PISCICULTURA}

    tanques_piscicolas = relationship(
        "ActividadesTanquesPiscicolas",
        cascade="all, delete-orphan",
        order_by="ActividadesTanquesPiscicolas.tanque_id",
        lazy="joined",
        passive_deletes=True,
    )

    def __json__(self, request):
        json = {c: getattr(self, c) for c in list(self.__mapper__.columns.keys())}
        del json["gid"]
        json["id"] = self.gid
        json["tanques_piscicolas"] = {
            "type": "FeatureCollection",
            "features": self.tanques_piscicolas,
        }
        return json

    def update_from_json(self, json, area_exp=None):
        # actividade - handled by sqlalchemy relationship
        SPECIAL_CASES = ["gid", "tanques_piscicolas"]
        self.gid = json.get("id")
        update_array(
            self.tanques_piscicolas,
            json.get("tanques_piscicolas"),
            ActividadesTanquesPiscicolas.create_from_json,
        )
        for tanque in self.tanques_piscicolas:
            if not tanque.tanque_id:
                tanque.tanque_id = id_service.calculate_new_child_id(
                    self.tanques_piscicolas, "tanque_id", json.get("exp_id")
                )

        for column in list(self.__mapper__.columns.keys()):
            if column in SPECIAL_CASES:
                continue
            setattr(self, column, json.get(column))
        if json.get("area_exploracao_for_calcs") is not None:
            self.area = json.get("area_exploracao_for_calcs")

    def validate(self, json):
        validator = Validator(actividades_schema.ActividadeSchema[c.K_PISCICULTURA])
        return validator.validate(json)


class ActividadesProduccaoEnergia(Actividade):
    __tablename__ = "actividades_produccao_energia"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    gid = Column(
        ForeignKey("utentes.actividades.gid", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )
    # energia_tipo = Column(ForeignKey(u'domains.energia_tipo.key', onupdate=u'CASCADE'))
    energia_tipo = Column(Text, doc="Tipo de producção")
    alt_agua = Column(Numeric(10, 2), doc="Altura de água")
    potencia = Column(Numeric(10, 2), doc="Potência a instalar")
    equipo = Column(Text, doc="Tipo de equipamento")
    eval_impac = Column(Boolean, doc="Evaluação de Impacto Ambiental")

    __mapper_args__ = {"polymorphic_identity": c.K_ENERGIA}

    def update_from_json(self, json):
        self.gid = json.get("id")
        self.tipo = json.get("tipo")
        self.c_estimado = json.get("c_estimado")
        self.energia_tipo = json.get("energia_tipo")
        self.alt_agua = json.get("alt_agua")
        self.potencia = json.get("potencia")
        self.equipo = json.get("equipo")
        self.eval_impac = json.get("eval_impac")

    def validate(self, json):
        validator = Validator(actividades_schema.ActividadeSchema[c.K_ENERGIA])
        return validator.validate(json)


class ActividadesSaneamento(Actividade):
    __tablename__ = "actividades_saneamento"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    gid = Column(
        ForeignKey("utentes.actividades.gid", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    )
    habitantes = Column(Integer, doc="Número de habitantes (Utilizadores)")

    __mapper_args__ = {"polymorphic_identity": c.K_SANEAMENTO}

    def update_from_json(self, json):
        self.gid = json.get("id")
        self.tipo = json.get("tipo")
        self.c_estimado = json.get("c_estimado")
        self.habitantes = json.get("habitantes")

    def validate(self, json):
        validator = Validator(actividades_schema.ActividadeSchema[c.K_SANEAMENTO])
        return validator.validate(json)
