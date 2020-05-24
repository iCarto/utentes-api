from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, Numeric, Text, text
from sqlalchemy.dialects.postgresql.json import JSONB

from utentes.models.base import PGSQL_SCHEMA_UTENTES, Base


class Renovacao(Base):
    __tablename__ = "renovacoes"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    gid = Column(
        Integer,
        primary_key=True,
        server_default=text("nextval('utentes.renovacoes_gid_seq'::regclass)"),
    )

    exp_id = Column(Text, nullable=False, unique=True, doc="Número da exploração")

    d_soli = Column(Date, doc="Data da solicitação")
    d_ultima_entrega_doc = Column(
        Date,
        nullable=False,
        server_default=text("now()"),
        doc="Data de entrega da última documentação",
    )

    estado = Column(Text, doc="Estado renovação")

    carta_ren = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Carta de requerimento de renovação",
    )
    carta_ren_v = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Carta de requerimento de renovação (validada)",
    )

    ident_pro = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Identificação do propietário",
    )
    ident_pro_v = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Identificação do propietário (validada)",
    )

    certi_reg = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Certificado de registo comercial",
    )
    certi_reg_v = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Certificado de registo comercial (validada)",
    )

    duat = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="DUAT ou declaração das estructuras locais (bairro)",
    )
    duat_v = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="DUAT ou declaração das estructuras locais (bairro) (validada)",
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
        doc="Solicitação da visitoria",
    )
    p_unid = Column(
        Boolean, nullable=False, server_default=text("false"), doc="Parecer da unidade"
    )
    p_tec = Column(
        Boolean, nullable=False, server_default=text("false"), doc="Parecer Técnico"
    )
    doc_legal = Column(
        Boolean, nullable=False, server_default=text("false"), doc="Documentação legal"
    )
    p_juri = Column(
        Boolean, nullable=False, server_default=text("false"), doc="Parecer Técnico"
    )
    p_rel = Column(
        Boolean,
        nullable=False,
        server_default=text("false"),
        doc="Parecer de instituições relevantes",
    )
    lic_imp = Column(
        Boolean, nullable=False, server_default=text("false"), doc="Licença impressa"
    )

    obser = Column(JSONB, doc="Observações renovacao")

    tipo_lic_sup_old = Column(
        Text, nullable=False, doc="Tipo de Licença superficial previa"
    )
    d_emissao_sup_old = Column(Date, doc="Data emissão superficial previa")
    d_validade_sup_old = Column(Date, doc="Data validade superficial previa")
    c_licencia_sup_old = Column(
        Numeric(10, 2), doc="Consumo licenciado superficial previo"
    )
    consumo_fact_sup_old = Column(
        Numeric(10, 2), doc="Consumo facturado superficial previo"
    )

    tipo_lic_sup = Column(Text, nullable=False, doc="Tipo de Licença superficial")
    d_emissao_sup = Column(Date, doc="Data emissão superficial")
    d_validade_sup = Column(Date, doc="Data validade superficial")
    c_licencia_sup = Column(Numeric(10, 2), doc="Consumo licenciado superficial")

    tipo_lic_sub_old = Column(
        Text, nullable=False, doc="Tipo de Licença subterrânea previa"
    )
    d_emissao_sub_old = Column(Date, doc="Data emissão subterrânea previo")
    d_validade_sub_old = Column(Date, doc="Data validade subterrânea previo")
    c_licencia_sub_old = Column(
        Numeric(10, 2), doc="Consumo licenciado subterrânea previo"
    )
    consumo_fact_sub_old = Column(
        Numeric(10, 2), doc="Consumo facturado subterrâneo previo"
    )

    tipo_lic_sub = Column(Text, nullable=False, doc="Tipo de Licença subterrânea")
    d_emissao_sub = Column(Date, doc="Data emissão subterrânea")
    d_validade_sub = Column(Date, doc="Data validade subterrânea")
    c_licencia_sub = Column(Numeric(10, 2), doc="Consumo licenciado subterrânea")

    exploracao = Column(
        ForeignKey("utentes.exploracaos.gid", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )

    def update_from_json(self, json):
        renovacao = json.get("renovacao")
        for column in set(self.__mapper__.columns.keys()) - {"gid"}:
            setattr(self, column, renovacao.get(column))

    def update_from_json_renovacao(self, json):
        self.exploracao = json.get("id")
        self.update_from_json(json)

    def __json__(self, json):
        json = {c: getattr(self, c) for c in list(self.__mapper__.columns.keys())}
        del json["gid"]
        json["id"] = self.gid

        return json
