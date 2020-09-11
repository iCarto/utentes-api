from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, Numeric, Text, text

from utentes.models.base import PGSQL_SCHEMA_UTENTES, Base


class Fonte(Base):
    __tablename__ = "fontes"
    __table_args__ = {"schema": PGSQL_SCHEMA_UTENTES}

    gid = Column(
        Integer,
        primary_key=True,
        server_default=text("nextval('utentes.fontes_gid_seq'::regclass)"),
    )
    tipo_agua = Column(Text, nullable=False, doc="Tipo de água")
    tipo_fonte = Column(Text, doc="Tipo de Fonte")
    cadastro = Column(Text, doc="Código Fonte/Cadastro")
    red_monit = Column(Text, nullable=False, doc="Red de monitoreo")
    disp_a = Column(Text, doc="Disponibilidade de agua")
    lat_lon = Column(Text, doc="Latitude / Longitud")
    d_dado = Column(Date, doc="Data toma de dados")
    bombeo = Column(Boolean, doc="Bombagem")
    c_soli = Column(Numeric(10, 2), doc="Consumo solicitado")
    c_max = Column(Numeric(10, 2), doc="Máximo caudal extraíble")
    prof_pozo = Column(Numeric(10, 2), doc="Profundidade (m)")
    diametro = Column(Numeric(10, 2), doc="Diâmetro interior (m)")
    c_real = Column(Numeric(10, 2), doc="Consumo real")
    sist_med = Column(Text, doc="Sistema de medição")
    metodo_est = Column(Text, doc="Método estimação volume")
    observacio = Column(Text, doc="Observações")
    exploracao = Column(
        ForeignKey("utentes.exploracaos.gid", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )

    @staticmethod
    def create_from_json(json):
        f = Fonte()
        f.update_from_json(json)
        return f

    def update_from_json(self, json):
        SPECIAL_CASES = ["gid", "exploracao"]
        self.gid = json.get("id")
        for column in list(self.__mapper__.columns.keys()):
            if column in SPECIAL_CASES:
                continue
            setattr(self, column, json.get(column))

    def __json__(self, request):
        SPECIAL_CASES = ["gid"]
        payload = {"id": self.gid}
        for column in list(self.__mapper__.columns.keys()):
            if column in SPECIAL_CASES:
                continue
            payload[column] = getattr(self, column)

        return payload

    def validate(self, json):
        return []
