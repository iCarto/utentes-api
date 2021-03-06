import json

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
    func,
    text,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql.json import JSONB
from sqlalchemy.orm import column_property, relationship

import utentes.models.constants as c
from utentes.lib.formatter.formatter import to_decimal
from utentes.lib.schema_validator.validation_exception import ValidationException
from utentes.models.actividade import Actividade
from utentes.models.base import (
    PGSQL_SCHEMA_UTENTES,
    Base,
    update_area,
    update_array,
    update_geom,
)
from utentes.models.facturacao import Facturacao
from utentes.models.facturacao_fact_estado import (
    PAID,
    PENDING_CONSUMPTION,
    PENDING_INVOICE,
    PENDING_PAYMENT,
)
from utentes.models.fonte import Fonte
from utentes.models.licencia import Licencia
from utentes.services import id_service


class ST_Multi(GenericFunction):
    name = "ST_Multi"
    type = Geometry


class ExploracaoBase(Base):
    __tablename__ = "exploracaos"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    gid = Column(
        Integer,
        primary_key=True,
        server_default=text("nextval('utentes.exploracaos_gid_seq'::regclass)"),
    )
    utente = Column(
        ForeignKey("utentes.utentes.gid", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
    exp_id = Column(Text, nullable=False, unique=True, doc="Número da exploração")
    exp_id_historic = Column(ARRAY(Text), doc="Histórico de Número da exploração")
    exp_name = Column(Text, nullable=False, doc="Nome da exploração")
    estado_lic = Column(Text, nullable=False, doc="Estado")

    actividade = relationship(
        "Actividade",
        cascade="all, delete-orphan",
        lazy="joined",
        # backref='exploracao_rel',
        uselist=False,
    )

    def __json__(self, request):
        # Workaround #1645
        actividade = self.actividade or {"id": None, "tipo": "Actividade non declarada"}
        return {
            "gid": self.gid,
            "exp_name": self.exp_name,
            "exp_id": self.exp_id,
            "actividade": actividade,
            "estado_lic": self.estado_lic,
        }


class ExploracaoGeom(ExploracaoBase):
    the_geom = Column(Geometry("MULTIPOLYGON", "32737"), index=True)
    geom_as_geojson = column_property(
        func.coalesce(func.ST_AsGeoJSON(func.ST_Transform(the_geom, 4326)), None)
    )

    def __json__(self, request):
        properties = {"exp_id": self.exp_id}
        the_geom = None
        if self.the_geom is not None:
            the_geom = json.loads(self.geom_as_geojson)
        return {"type": "Feature", "properties": properties, "geometry": the_geom}


class Exploracao(ExploracaoGeom):
    REQUERIMENTO_FIELDS = [
        "carta_re",
        "ficha_pe",
        "ident_pro",
        "certi_reg",
        "duat",
        "licen_am",
        "mapa",
        "licen_fu",
        "r_perf",
        "b_a_agua",
        "carta_re_v",
        "ficha_pe_v",
        "ident_pro_v",
        "certi_reg_v",
        "duat_v",
        "licen_am_v",
        "mapa_v",
        "licen_fu_v",
        "r_perf_v",
        "b_a_agua_v",
        "anali_doc",
        "soli_visit",
        "p_unid",
        "p_tec",
        "p_tec_disp_hidrica",
        "doc_legal",
        "p_juri",
        "p_rel",
        "req_obs",
        "created_at",
        "exp_name",
        "lic_imp",
        "d_soli",
        "d_ultima_entrega_doc",
    ]

    FACTURACAO_FIELDS = ["fact_estado", "fact_tipo", "pago_lic"]

    NORMAL_FIELDS = [
        "observacio",
        "loc_provin",
        "loc_distri",
        "loc_posto",
        "loc_nucleo",
        "loc_endere",
        "loc_unidad",
        "loc_bacia",
        "loc_subaci",
        "loc_rio",
        "cadastro_uni",
        "d_titulo",
        "d_proceso",
        "d_folha",
        "d_parcela",
        "d_area",
        "d_d_emis",
        "d_l_emis",
        "c_soli",
        "c_licencia",
        "c_real",
        "c_estimado",
    ]

    READ_ONLY = ["created_at"]
    d_soli = Column(
        Date, nullable=False, server_default=text("now()"), doc="Data da solicitação"
    )
    d_ultima_entrega_doc = Column(
        Date,
        nullable=False,
        server_default=text("now()"),
        doc="Data de entrega da última documentação",
    )
    observacio = Column(Text, doc="Observações")
    d_titulo = Column(Text, doc="Número do título")
    d_proceso = Column(Text, doc="Número do processo")
    d_folha = Column(Text, doc="Número de folha")
    d_parcela = Column(Text, doc="Número de parcela")
    d_area = Column(Numeric(10, 4), doc="Área (ha)")
    d_d_emis = Column(Date, doc="Data de emissão")
    d_l_emis = Column(Text, doc="Local de emissão")
    loc_provin = Column(Text, doc="Província")
    loc_distri = Column(Text, doc="Distrito")
    loc_posto = Column(Text, doc="Posto administrativo")
    loc_nucleo = Column(Text, doc="Bairro")
    loc_endere = Column(Text, doc="Endereço")
    loc_unidad = Column(Text, doc="Unidade")
    loc_bacia = Column(Text, doc="Bacia")
    loc_subaci = Column(Text, doc="Sub-bacia")
    loc_rio = Column(Text, doc="Rio")
    cadastro_uni = Column(Text, doc="Número do cadastro unificado")
    c_soli = Column(Numeric(10, 2), doc="Consumo mensal solicitado ")
    c_licencia = Column(Numeric(10, 2), doc="Consumo mensal licenciado")
    c_real = Column(Numeric(10, 2), doc="Consumo mensal real")
    c_estimado = Column(Numeric(10, 2), doc="Consumo mensal estimado ")
    area = Column(Numeric(10, 4), doc="")

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=text("now()"),
        doc="Data creación requerimento",
    )

    carta_re = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Carta de requerimento",
    )
    ficha_pe = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Ficha de pedido preenchida",
    )
    ident_pro = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Identificação do proprietário",
    )
    certi_reg = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Certificado de registo comercial",
    )
    duat = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="DUAT ou declaração das estructuras locais (bairro)",
    )
    licen_am = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Licença ambiental (se é preciso)",
    )
    mapa = Column(
        Boolean, nullable=False, server_default=text("false"), doc="Mapa de localização"
    )
    licen_fu = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Licença de apertura de poço/furo  (se é preciso)",
    )
    r_perf = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Relatório técnico de perforação (se é preciso)",
    )
    b_a_agua = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Boletim de análise de água",
    )

    carta_re_v = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Carta de requerimento (validada)",
    )
    ficha_pe_v = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Ficha de pedido preenchida (validada)",
    )
    ident_pro_v = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Identificação do proprietário (validada)",
    )
    certi_reg_v = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Certificado de registo comercial (validada)",
    )
    duat_v = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="DUAT ou declaração das estructuras locais (bairro) (validada)",
    )
    licen_am_v = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Relatório técnico de perforação (se é preciso) (validada)",
    )
    mapa_v = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Mapa de localização (validada)",
    )
    licen_fu_v = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Licença de apertura de poço/furo  (se é preciso) (validada)",
    )
    r_perf_v = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Licença ambiental (se é preciso) (validada)",
    )
    b_a_agua_v = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Boletim de análise de água (validada)",
    )

    anali_doc = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Análise da documentação",
    )
    soli_visit = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Solicitação da vistoria",
    )
    p_unid = Column(
        Boolean, nullable=False, server_default=text("false"), doc="Parecer da unidade"
    )
    p_tec = Column(
        Boolean, nullable=False, server_default=text("false"), doc="Parecer técnico"
    )
    p_tec_disp_hidrica = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Avaliação disponibilidade hídrica (WEAP WAM-T)",
    )
    doc_legal = Column(
        Boolean, nullable=False, server_default=text("false"), doc="Documentação legal"
    )
    p_juri = Column(
        Boolean, nullable=False, server_default=text("false"), doc="Parecer técnico"
    )
    p_rel = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Parecer de instituições relevantes",
    )
    req_obs = Column(JSONB, doc="Observações requerimento")
    ara = Column(Text, nullable=False, doc="ARA")

    fact_estado = Column(
        Text, nullable=False, doc="Estado de pago del ciclo de facturación"
    )
    fact_tipo = Column(
        Text,
        nullable=False,
        server_default=text("'Mensal'::text"),
        doc="Mensal/Trimestral/Anual",
    )
    pago_lic = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Factura emisión licencia pagada",
    )
    lic_imp = Column(
        Boolean, nullable=False, server_default=text("false"), doc="Licença impressa"
    )

    utente_rel = relationship("Utente", lazy="joined")

    licencias = relationship(
        "Licencia", cascade="all, delete-orphan", lazy="joined", passive_deletes=True
    )
    fontes = relationship(
        "Fonte", cascade="all, delete-orphan", lazy="joined", passive_deletes=True
    )

    def get_licencia(self, tipo):
        for lic in self.licencias:
            if lic.tipo_agua.upper().startswith(tipo.upper()):
                return lic
        return Licencia()

    def _which_exp_id_should_be_used(self, request, body):
        new_state = body.get("state_to_set_after_validation") or body.get("estado_lic")
        if not self.exp_id and not body.get("exp_id"):
            return id_service.calculate_new_exp_id(request, new_state)

        if new_state == self.estado_lic:
            return body.get("exp_id")

        if not self.estado_lic:
            return id_service.calculate_new_exp_id(request, new_state)

        if new_state == c.K_DE_FACTO or self.estado_lic == c.K_DE_FACTO:
            return id_service.calculate_new_exp_id(request, new_state)

        if new_state == c.K_USOS_COMUNS or self.estado_lic == c.K_USOS_COMUNS:
            return id_service.calculate_new_exp_id(request, new_state)

        return body.get("exp_id")

    def setLicStateAndExpId(self, request, body):
        exp_id_to_use = self._which_exp_id_should_be_used(request, body)

        if self.exp_id and exp_id_to_use != self.exp_id:
            # por como funciona sqlalchemy si hacemos el append directamente
            # en el campo no se entera de que ha cambiado (es el mismo obj)
            # tenemos que asignarle otro objeto
            exp_id_historic = self.exp_id_historic[:] if self.exp_id_historic else []
            exp_id_historic.append(self.exp_id)
            self.exp_id_historic = exp_id_historic

        self.exp_id = exp_id_to_use
        for lic in self.licencias:
            lic.lic_nro = id_service.calculate_lic_nro(self.exp_id, lic.tipo_agua)
        if self.actividade and getattr(self.actividade, "cultivos", None):
            for cult in self.actividade.cultivos:
                cult.cult_id = id_service.replace_exp_id_in_code(
                    cult.cult_id, self.exp_id
                )
        if self.actividade and getattr(self.actividade, "tanques_piscicolas", None):
            for tanque in self.actividade.tanques_piscicolas:
                tanque.tanque_id = id_service.replace_exp_id_in_code(
                    tanque.tanque_id, self.exp_id
                )

        if body.get("state_to_set_after_validation"):
            new_state = body.get("state_to_set_after_validation")
            self.estado_lic = new_state
            for lic in self.licencias:
                lic.estado = new_state
        else:
            new_state = body.get("estado_lic")
            self.estado_lic = new_state

    def update_from_json_requerimento(self, request, json):
        self._update_requerimento_fields(json)
        self.setLicStateAndExpId(request, json)
        self.fact_estado = "Não facturable"
        self.fact_tipo = "Mensal"
        self.pago_lic = False

    def _update_requerimento_fields(self, json):
        for column in set(self.REQUERIMENTO_FIELDS) - set(self.READ_ONLY):
            setattr(self, column, json.get(column))

    def update_from_json_renovacao(self, request, json):
        self.setLicStateAndExpId(request, json)

        # Si no son nulos habré pasado por JuridicoDatos/Pendente Datos Renovacao
        # y al llegar a uno de estos estados debo actualizar datos en la exp.
        # Para no llamar directamente a api/exploracaos (puedo no tener todos los
        # campo de la exp) lo hago aqui.
        self.d_soli = json.get("d_soli")
        self.d_ultima_entrega_doc = json.get("d_ultima_entrega_doc")
        self.c_licencia = json.get("c_licencia")
        for json_lic in json.get("licencias"):
            lic = self.get_licencia(json_lic["tipo_agua"])
            lic.tipo_lic = json_lic.get("tipo_lic")
            lic.d_emissao = json_lic.get("d_emissao")
            lic.d_validade = json_lic.get("d_validade")
            lic.c_licencia = to_decimal(json_lic.get("c_licencia"))

    def update_from_json_facturacao(self, json):
        self.fact_estado = self.get_lower_state(json["facturacao"])
        self.fact_tipo = json["fact_tipo"]
        self.pago_lic = json["pago_lic"]

        # get last factura emited order by date desc
        json["facturacao"] = sorted(
            json["facturacao"], key=Facturacao.json_fact_order_key, reverse=True
        )
        json_fact = json["facturacao"][0]

        # complete licenca data with last factura values
        lic_sup = self.get_licencia("sup")
        lic_sup.consumo_tipo = json_fact["consumo_tipo_sup"]
        lic_sup.taxa_fixa = json_fact["taxa_fixa_sup"]
        lic_sup.taxa_uso = json_fact["taxa_uso_sup"]
        lic_sup.consumo_fact = json_fact["consumo_fact_sup"]
        lic_sup.iva = json_fact["iva"]
        lic_sup.pago_mes = json_fact["pago_mes_sup"]
        lic_sup.pago_iva = json_fact["pago_iva_sup"]

        lic_sub = self.get_licencia("sub")
        lic_sub.consumo_tipo = json_fact["consumo_tipo_sub"]
        lic_sub.taxa_fixa = json_fact["taxa_fixa_sub"]
        lic_sub.taxa_uso = json_fact["taxa_uso_sub"]
        lic_sub.consumo_fact = json_fact["consumo_fact_sub"]
        lic_sub.iva = json_fact["iva"]
        lic_sub.pago_mes = json_fact["pago_mes_sub"]
        lic_sub.pago_iva = json_fact["pago_iva_sub"]

        # update all facturacao elements
        for index, json_fact in enumerate(json["facturacao"]):
            fact = next(
                (
                    factura
                    for factura in self.facturacao
                    if factura.gid == json_fact["id"]
                ),
                None,
            )
            for column in list(json_fact.keys()):
                setattr(fact, column, json_fact.get(column))
            fact.pago_mes = (
                (fact.pago_mes_sup or 0) + (fact.pago_mes_sub or 0)
            ) or None
            fact.pago_iva_sup = (
                (fact.pago_mes_sup or 0) * (1 + (float(fact.iva_sup or 0)) / 100)
            ) or None
            fact.pago_iva_sub = (
                (fact.pago_mes_sub or 0) * (1 + (float(fact.iva_sub or 0)) / 100)
            ) or None

    def get_lower_state(self, facturas):
        status_weight = {
            PENDING_CONSUMPTION: 0,
            PENDING_INVOICE: 1,
            PENDING_PAYMENT: 2,
            PAID: 3,
        }
        lower_state = None
        for factura in facturas:
            if lower_state is None:
                lower_state = factura["fact_estado"]
                continue
            if status_weight[factura["fact_estado"]] < status_weight[lower_state]:
                lower_state = factura["fact_estado"]
        return lower_state

    def update_from_json(self, request, json):
        self.gid = json.get("id")
        self.update_some_fields(request, json)
        self.the_geom = update_geom(self.the_geom, json)
        self.fact_estado = json.get("fact_estado") or "Não facturable"
        self.fact_tipo = json.get("fact_tipo") or "Mensal"
        self.pago_lic = json.get("pago_lic") or False

        self._update_requerimento_fields(json)
        update_area(self, json)
        self.update_and_validate_activity(json)

        # update relationships
        update_array(self.fontes, json.get("fontes"), Fonte.create_from_json)

        update_array(self.licencias, json.get("licencias"), Licencia.create_from_json)

        self.setLicStateAndExpId(request, json)

    def update_some_fields(self, request, json):
        # Probablmente se podrían gestionar aquí sin problemas otras columnas
        # como c_soli que hace el to_decimal, pero no se ha probado. Queda para
        # futuros refactorings
        SPECIAL_CASES = ["gid"]

        self.gid = json.get("id")
        for column in list(self.__mapper__.columns.keys()):
            if column in SPECIAL_CASES:
                continue
            if column not in self.NORMAL_FIELDS:
                continue
            setattr(self, column, json.get(column))

    def update_and_validate_activity(self, json):
        actividade_json = json.get("actividade")
        if json.get("geometry_edited"):
            actividade_json["area_exploracao_for_calcs"] = self.area
        actividade_json["exp_id"] = json.get("exp_id")

        if not self.actividade:
            actv = Actividade.create_from_json(actividade_json)
            msgs = self.validate_activity(actv, json.get("actividade"), json)
            if len(msgs) > 0:
                raise ValidationException({"error": msgs})
            self.actividade = actv
        elif self.actividade:
            msgs = self.validate_activity(self.actividade, actividade_json, json)
            if len(msgs) > 0:
                raise ValidationException({"error": msgs})
            self.actividade.update_from_json(actividade_json)

        if actividade_json.get("tipo") == c.K_AGRICULTURA:
            self.c_estimado = self.actividade.c_estimado

    def validate_activity(self, activity, attributes, json):
        msgs = []
        statuses = [
            Licencia.implies_validate_activity(lic["estado"])
            for lic in json["licencias"]
        ]
        if any(statuses):
            msgs = activity.validate(attributes)
        return msgs

    @staticmethod
    def create_from_json(request, body):
        e = Exploracao()
        e.update_from_json(request, body)
        return e

    def __json__(self, request):
        the_geom = None
        if self.the_geom is not None:

            the_geom = json.loads(self.geom_as_geojson)
        payload = {
            "type": "Feature",
            "properties": {
                "id": self.gid,
                "exp_id": self.exp_id,
                "estado_lic": self.estado_lic,
                "actividade": self.actividade,
                "area": self.area,
                "fontes": self.fontes or [],
                "licencias": self.licencias,
                "utente": {},
            },
            "geometry": the_geom,
        }

        for column in self.REQUERIMENTO_FIELDS:
            payload["properties"][column] = getattr(self, column)

        for column in self.FACTURACAO_FIELDS:
            payload["properties"][column] = getattr(self, column)

        for column in self.NORMAL_FIELDS:
            payload["properties"][column] = getattr(self, column)

        if self.utente_rel:
            payload["properties"]["utente"] = self.utente_rel.own_columns_as_dict()

        return payload


class ExploracaoConFacturacao(Exploracao):
    fontes = None
    actividade = relationship(
        "ActividadeBase",
        cascade="all, delete-orphan",
        lazy="joined",
        # backref='exploracao_rel',
        uselist=False,
    )

    facturacao = relationship(
        "Facturacao",
        cascade="all, delete-orphan",
        lazy="joined",
        passive_deletes=True,
        order_by="Facturacao.exploracao, Facturacao.ano, Facturacao.mes",
    )

    __mapper_args__ = {"exclude_properties": ["fontes"]}

    def __json__(self, request):
        payload = super().__json__(request)
        payload["properties"]["facturacao"] = self.facturacao
        return payload
