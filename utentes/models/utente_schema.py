# -*- coding: utf-8 -*-

UTENTE_SCHEMA = [
    {
        "fieldname": "nome",
        "message": '"Nome de utente" não pode estar vazio',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "uten_memb",
        "message": '"Nro membros" não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "uten_mulh",
        "message": '"Nro mulheres" não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]
