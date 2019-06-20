# -*- coding: utf-8 -*-

EXPLORACAO_SCHEMA = [
    {
        "fieldname": "exp_id",
        "message": u"Nro de exploracão não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "exp_id",
        "message": u"Nro de exploracão não tem o formato correto",
        "rules": ["EXP_ID_FORMAT"],
    },
    {
        "fieldname": "exp_name",
        "message": u"Nome da exploracão não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "d_soli",
        "message": u"Data de solicitação não tem o formato correto",
        "rules": ["IS_DATE"],
    },
    {
        "fieldname": "c_soli",
        "message": u"Consumo solicitado não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "c_licencia",
        "message": u"Consumo licenciado não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "c_real",
        "message": u"Consumo real não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "c_estimado",
        "message": u"Consumo estimado não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area",
        "message": u"Área não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

EXPLORACAO_SCHEMA_CON_FICHA = [
    {
        "fieldname": "loc_provin",
        "message": u"A provincia da exploracão não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "loc_distri",
        "message": u"O distrito da exploracão não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "loc_posto",
        "message": u"O posto da exploracão não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "loc_unidad",
        "message": u"A unidade da exploracão não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "utente",
        "message": u"A exploracão debe ter um utemte",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "actividade",
        "message": u"A exploracão debe ter uma actividade",
        "rules": ["ACTIVITY_NOT_NULL"],
    },
    {
        "fieldname": "licencias",
        "message": u"A exploracão debe ter uma licença",
        "rules": ["ARRAY_NOT_VOID"],
    },
]
