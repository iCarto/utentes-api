from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    Text,
    UniqueConstraint,
    func,
    text,
)
from sqlalchemy.dialects.postgresql.json import JSONB
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.sql.expression import and_, case, null

from utentes.models.base import PGSQL_SCHEMA_UTENTES, Base
from utentes.models.facturacao_fact_estado import PENDING_CONSUMPTION


class Facturacao(Base):
    __tablename__ = "facturacao"
    __table_args__ = (
        UniqueConstraint("exploracao", "ano", "mes"),
        {"schema": PGSQL_SCHEMA_UTENTES},
    )

    gid = Column(
        Integer,
        primary_key=True,
        server_default=text("nextval('utentes.facturacao_gid_seq'::regclass)"),
    )
    exploracao = Column(
        ForeignKey("utentes.exploracaos.gid", ondelete="CASCADE", onupdate="CASCADE"),
        nullable=False,
    )
    # exploracao = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=text("now()"))
    updated_at = Column(DateTime, nullable=False, server_default=text("now()"))

    ano = Column(
        Text, nullable=False, server_default=text("to_char(now(), 'YYYY'::text)")
    )
    mes = Column(
        Text, nullable=False, server_default=text("to_char(now(), 'MM'::text)")
    )
    observacio = Column(JSONB)
    fact_estado = Column(
        Text,
        nullable=False,
        server_default=text(f"'{PENDING_CONSUMPTION}'::text"),
    )
    fact_tipo = Column(Text, nullable=False, server_default=text("'Mensal'::text"))
    pago_lic = Column(Boolean)
    c_licencia_sup = Column(Numeric(10, 2))
    c_licencia_sub = Column(Numeric(10, 2))
    consumo_tipo_sup = Column(Text, nullable=False, server_default=text("'Fixo'::text"))
    consumo_fact_sup = Column(Numeric(10, 2))
    taxa_fixa_sup = Column(Numeric(10, 2))
    taxa_uso_sup = Column(Numeric(10, 2))
    pago_mes_sup = Column(Numeric(10, 2))
    pago_iva_sup = Column(Numeric(10, 2))
    iva_sup = Column(Numeric(10, 2))
    consumo_tipo_sub = Column(Text, nullable=False, server_default=text("'Fixo'::text"))
    consumo_fact_sub = Column(Numeric(10, 2))
    taxa_fixa_sub = Column(Numeric(10, 2))
    taxa_uso_sub = Column(Numeric(10, 2))
    pago_mes_sub = Column(Numeric(10, 2))
    pago_iva_sub = Column(Numeric(10, 2))
    iva_sub = Column(Numeric(10, 2))
    iva = Column(Numeric(10, 2))
    juros = Column(Numeric(10, 2))
    pago_mes = Column(Numeric(10, 2))
    pago_iva = Column(Numeric(10, 2))
    fact_id = Column(Text, unique=True)
    recibo_id = Column(Text, unique=True)
    fact_date = Column(Date)
    recibo_date = Column(Date)

    @staticmethod
    def json_fact_order_key(factura):
        return factura["ano"] + factura["mes"]

    def has_water_type(self, _water_type: str) -> bool:
        """
        _water_type could be 'Sup', 'Superficial', 'sup', ...
        returns true if this invoice has data for this kind of water type

        TODO: This method is error prone
        """
        water_type = _water_type[:3].lower()
        template_atts_to_eval = ("c_licencia_", "taxa_fixa_", "taxa_uso_")
        atts_to_eval = [f"{att}{water_type}" for att in template_atts_to_eval]
        return all(getattr(self, att) is not None for att in atts_to_eval)

    def billing_period(self) -> str:
        """
        Calculates the string representation of the billing period for an invoice
        Check that InvoiceService.js provides the same implementation
        """
        billing_cycle = self.fact_tipo
        month = int(self.mes)
        year = int(self.ano)

        if billing_cycle == "Mensal":
            if month == 1:
                return f"12/{year - 1}"

            return f"{str(month - 1).zfill(2)}/{year}"

        if billing_cycle == "Trimestral":
            if month == 4:
                return f"01/{year} - 03/{year}"

            if month == 7:
                return f"04/{year} - 06/{year}"

            if month == 10:
                return f"07/{year} - 09/{year}"

            if month == 1:
                return f"10/{year - 1} - 12/{year - 1}"

        if billing_cycle == "Anual":
            return f"{year - 1}"

        raise Exception(
            "Invalid input data to calculate the billing period",
            billing_cycle,
            year,
            month,
        )

    @hybrid_property
    def consumo(self):
        # es la suma del consumo facturado para la licencia subterránea y el consumo
        # facturado para la licencia superficial. En caso de que no hayan introducido
        # ningún consumo facturado en la factura, entonces el consumo facturado es el
        # consumo licenciado
        return case(
            [
                (
                    and_(
                        self.consumo_fact_sub == null(), self.consumo_fact_sup == null()
                    ),
                    self.consumo_lic,
                )
            ],
            else_=func.coalesce(self.consumo_fact_sub, 0)
            + func.coalesce(self.consumo_fact_sup, 0),
        )

    @hybrid_property
    def consumo_lic(self):
        # es la suma del consumo licenciado para la licencia subterránea y el consumo
        # licenciado para la licencia superficial
        return func.coalesce(self.c_licencia_sub, 0) + func.coalesce(
            self.c_licencia_sup, 0
        )

    def __json__(self, request):
        json = {c: getattr(self, c) for c in list(self.__mapper__.columns.keys())}
        del json["gid"]
        json["id"] = self.gid
        return json
