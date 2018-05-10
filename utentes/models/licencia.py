# -*- coding: utf-8 -*-

from sqlalchemy import Column, Date, ForeignKey, Integer, Numeric, Text, text

from utentes.lib.formatter.formatter import to_decimal, to_date
from utentes.models.base import Base, PGSQL_SCHEMA_UTENTES


class Licencia(Base):
    __tablename__ = 'licencias'
    __table_args__ = {u'schema': PGSQL_SCHEMA_UTENTES}

    gid = Column(Integer, primary_key=True, server_default=text("nextval('utentes.licencias_gid_seq'::regclass)"))
    lic_nro = Column(Text, nullable=False, unique=True, doc='Nro de Licença')
    tipo_agua = Column(Text, nullable=False, doc='Tipo de água')
    tipo_lic = Column(Text, nullable=False, doc='Tipo de Licença')
    cadastro = Column(Text, doc='Nro de Cadastro')
    n_licen_a = Column(Text, doc='Nro de licença histórico')
    estado = Column(Text, nullable=False, doc='Estado')
    d_emissao = Column(Date, doc='Data emissão')
    d_validade = Column(Date, doc='Data validade')
    c_soli_tot = Column(Numeric(10, 2), doc='Consumo solicitado total')
    c_soli_int = Column(Numeric(10, 2), doc='Consumo solicitado intermédio')
    c_soli_fon = Column(Numeric(10, 2), doc='Consumo solicitado fontes')
    c_licencia = Column(Numeric(10, 2), doc='Consumo licenciado')
    c_real_tot = Column(Numeric(10, 2), doc='Consumo real total')
    c_real_int = Column(Numeric(10, 2), doc='Consumo real intermédio')
    c_real_fon = Column(Numeric(10, 2), doc='Consumo real fontes')
    taxa_fixa = Column(Numeric(10, 2), nullable=False, doc='Taxa fixa')
    taxa_uso = Column(Numeric(10, 2), nullable=False, doc='Taxa de uso')
    pago_mes = Column(Numeric(10, 2), doc='Valor pago mensual')
    iva = Column(Integer, nullable=False, doc='IVA')
    pago_iva = Column(Numeric(10, 2), doc='Valor com IVA')
    exploracao = Column(
        ForeignKey(
            u'utentes.exploracaos.gid',
            ondelete=u'CASCADE',
            onupdate=u'CASCADE'),
        nullable=False)

    @staticmethod
    def create_from_json(json):
        l = Licencia()
        l.update_from_json(json)
        return l

    def update_from_json(self, json):
        self.gid = json.get('id')
        self.lic_nro = json.get('lic_nro')
        self.tipo_agua = json.get('tipo_agua')
        self.tipo_lic = json.get('tipo_lic')
        self.finalidade = json.get('finalidade')
        self.cadastro = json.get('cadastro')
        self.n_licen_a = json.get('n_licen_a')
        self.estado = json.get('estado')
        self.d_emissao = to_date(json.get('d_emissao'))
        self.d_validade = to_date(json.get('d_validade'))
        self.c_soli_tot = to_decimal(json.get('c_soli_tot'))
        self.c_soli_int = to_decimal(json.get('c_soli_int'))
        self.c_soli_fon = to_decimal(json.get('c_soli_fon'))
        self.c_licencia = to_decimal(json.get('c_licencia'))
        self.c_real_tot = to_decimal(json.get('c_real_tot'))
        self.c_real_int = to_decimal(json.get('c_real_int'))
        self.c_real_fon = to_decimal(json.get('c_real_fon'))
        self.taxa_fixa = to_decimal(json.get('taxa_fixa'))
        self.taxa_uso = to_decimal(json.get('taxa_uso'))
        self.pago_mes = to_decimal(json.get('pago_mes'))
        self.iva = json.get('iva')
        self.pago_iva = to_decimal(json.get('pago_iva'))

    def __json__(self, request):
        return {
            'id': self.gid,
            'lic_nro': self.lic_nro,
            'tipo_agua': self.tipo_agua,
            'tipo_lic': self.tipo_lic,
            'cadastro': self.cadastro,
            'n_licen_a': self.n_licen_a,
            'estado': self.estado,
            'd_emissao': self.d_emissao,
            'd_validade': self.d_validade,
            'c_soli_tot': self.c_soli_tot,
            'c_soli_int': self.c_soli_int,
            'c_soli_fon': self.c_soli_fon,
            'c_licencia': self.c_licencia,
            'c_real_tot': self.c_real_tot,
            'c_real_int': self.c_real_int,
            'c_real_fon': self.c_real_fon,
            'taxa_fixa': self.taxa_fixa,
            'taxa_uso': self.taxa_uso,
            'pago_mes': self.pago_mes,
            'iva': self.iva,
            'pago_iva': self.pago_iva,
            'exploracao': self.exploracao,
        }

    def validate(self, json):
        return []

    @staticmethod
    def implies_validate_activity(estado):
        return estado not in [
            u'Desconhecido',
            u'Irregular',
            u'Não aprovada',
            u'Pendente de solicitação do utente',
            u'Pendente de revisão da solicitação (Direcção)',
            u'Pendente de revisão da solicitação (Chefe DT)',
            u'Pendente de revisão da solicitação (D. Jurídico)',
            u'Pendente de aprovação técnica (R. Cadastro)',
        ]
