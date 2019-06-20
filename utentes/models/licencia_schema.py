# -*- coding: utf-8 -*-

LICENCIA_SCHEMA = [
    {
        "fieldname": "tipo_agua",
        "message": u"Tipo de agua não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "lic_nro",
        "message": u"Nro de licença não tem o formato correto",
        "rules": ["LIC_NRO_FORMAT"],
    },
    {
        "fieldname": "estado",
        "message": u"A licença debe ter um estado",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "d_emissao",
        "message": u"Data emissão não tem o formato correto",
        "rules": ["IS_DATE"],
    },
    {
        "fieldname": "d_validade",
        "message": u"Data validade não tem o formato correto",
        "rules": ["IS_DATE"],
    },
    {
        "fieldname": "c_soli_tot",
        "message": u"O consumo solicitado da licença não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "c_soli_int",
        "message": u"Consumo solicitado intermedio da licença não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "c_soli_fon",
        "message": u"Consumo solicitado das fontes não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "c_licencia",
        "message": u"Consumo licenciado não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "c_real_tot",
        "message": u"Consumo real não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "c_real_int",
        "message": u"Consumo real intermedio não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "c_real_fon",
        "message": u"Consumo real das fontes não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "taxa_fixa",
        "message": u"Taxa fixa da licença não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "taxa_uso",
        "message": u"Taxa de uso da licença não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "pago_mes",
        "message": u"Valor pago mensual da licença não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "iva",
        "message": u"IVA da licença não tem o formato correto",
        "rules": ["NOT_NULL", "IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "pago_iva",
        "message": u"Valor com IVA da licença não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "consumo_tipo",
        "message": u"O tipo de consumo é obligatorio",
        "rules": ["NOT_NULL"],
    },
]
