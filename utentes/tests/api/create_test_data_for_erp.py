import datetime

from utentes.erp.model import ExploracaosERP
from utentes.models.actividade import ActividadesAbastecemento
from utentes.models.constants import (
    K_ABASTECIMENTO,
    K_LICENSED,
    K_SUBTERRANEA,
    MONTHTLY,
)
from utentes.models.exploracao import Exploracao
from utentes.models.facturacao import Facturacao
from utentes.models.facturacao_fact_estado import PENDING_PAYMENT
from utentes.models.licencia import Licencia
from utentes.models.utente import Utente


class GIDGenerator(object):
    licencia_gid = 0
    utente_gid = 0
    actividade_gid = 0
    exploracao_gid = 0
    erp_client_id = 0
    facturacao_gid = 0

    @classmethod
    def next_licencia(cls):
        cls.licencia_gid += 1
        return cls.licencia_gid

    @classmethod
    def next_utente(cls):
        cls.utente_gid += 1
        return cls.utente_gid

    @classmethod
    def next_actividade(cls):
        cls.actividade_gid += 1
        return cls.actividade_gid

    @classmethod
    def next_exploracao(cls):
        cls.exploracao_gid += 1
        return cls.exploracao_gid

    @classmethod
    def next_erp_client(cls):
        cls.erp_client_id += 1
        return cls.erp_client_id

    @classmethod
    def next_facturacao(cls):
        cls.facturacao_gid += 1
        return cls.facturacao_gid


gid_generator = GIDGenerator()


def create_test_licencia(exp_id, **kwargs):
    licencia = Licencia()
    licencia.gid = gid_generator.next_licencia()
    licencia.tipo_agua = K_SUBTERRANEA
    licencia.c_licencia = 2
    licencia.estado = K_LICENSED  # Utente de facto UF
    for k, v in kwargs.items():
        setattr(licencia, k, v)
    licencia.lic_nro = f"{exp_id}/{licencia.tipo_agua[:3]}"
    # licencia.exploracao =
    return licencia


def create_test_utente():
    utente = Utente()
    utente.gid = gid_generator.next_utente()
    utente.nome = f"Utente {utente.gid}"
    utente.bi_di_pas = "012345678901I"
    utente.nuit = "012345678"
    utente.telefone = "827821780/873081514"
    utente.email = "utente@test.com"
    return utente


def create_test_actividade():
    actividade = ActividadesAbastecemento()
    actividade.gid = gid_generator.next_actividade()
    # actividade.exploracao = 1
    actividade.tipo = K_ABASTECIMENTO
    actividade.c_estimado = 0
    actividade.habitantes = 0
    actividade.dotacao = 20
    return actividade


def create_test_exploracao(**kwargs):
    exp = Exploracao()
    exp.gid = gid_generator.next_exploracao()
    exp.exp_id = f"{str(exp.gid).zfill(3)}/ARAS/2020/CL"
    exp.exp_name = f"Exploracao {exp.gid}"
    exp.estado_lic = K_LICENSED
    exp.loc_unidad = "UGBI"
    exp.loc_bacia = "Incomati"
    exp.loc_provin = "Maputo"
    exp.loc_distri = "Moamba"
    exp.loc_posto = "Sabie"
    exp.loc_nucleo = None
    exp.fact_estado = "Pendente Emisão Factura (DF)"

    exp.actividade = create_test_actividade()
    exp.utente_rel = create_test_utente()
    exp.licencias.append(create_test_licencia(exp.exp_id))
    for k, v in kwargs.items():
        setattr(exp, k, v)
    return exp


def create_test_exploracao_erp(exp: Exploracao):
    exp_erp = ExploracaosERP()
    exp_erp.id = gid_generator.next_erp_client()
    exp_erp.exploracao_gid = exp.gid
    exp_erp.update_link_id(exp)
    return exp_erp


def create_test_invoice(exp: Exploracao, year, month, **kwargs):
    invoice = Facturacao()
    invoice.gid = gid_generator.next_facturacao()
    invoice.exploracao = exp.gid
    invoice.created_at = datetime.datetime(year, month, 1)
    invoice.updated_at = invoice.updated_at
    invoice.ano = year
    invoice.mes = month
    invoice.fact_estado = PENDING_PAYMENT
    invoice.fact_tipo = MONTHTLY
    invoice.c_licencia_sup = exp.get_licencia("sup").c_licencia
    invoice.c_licencia_sub = exp.get_licencia("sub").c_licencia
    invoice.consumo_tipo_sup = exp.get_licencia("sup").consumo_tipo
    invoice.consumo_fact_sup = exp.get_licencia("sup").c_licencia
    invoice.taxa_fixa_sup = exp.get_licencia("sup").c_licencia and 1
    invoice.taxa_uso_sup = exp.get_licencia("sup").c_licencia and 1
    invoice.pago_mes_sup = exp.get_licencia("sup").c_licencia and 1
    invoice.pago_iva_sup = exp.get_licencia("sup").c_licencia and 1
    invoice.iva_sup = exp.get_licencia("sup").c_licencia and 1
    invoice.consumo_tipo_sub = exp.get_licencia("sub").consumo_tipo
    invoice.consumo_fact_sub = exp.get_licencia("sub").c_licencia
    invoice.taxa_fixa_sub = exp.get_licencia("sub").c_licencia and 2
    invoice.taxa_uso_sub = exp.get_licencia("sub").c_licencia and 2
    invoice.pago_mes_sub = exp.get_licencia("sub").c_licencia and 2
    invoice.pago_iva_sub = exp.get_licencia("sub").c_licencia and 2
    invoice.iva_sub = exp.get_licencia("sub").c_licencia and 2
    invoice.iva = 12.75
    invoice.juros = 1
    invoice.pago_mes = 1
    invoice.pago_iva = 1
    invoice.fact_id = invoice.gid
    invoice.fact_date = datetime.date(year, month, 5)
    for k, v in kwargs.items():
        setattr(invoice, k, v)
    return invoice
