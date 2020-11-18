UTENTE_SCHEMA = [
    {
        "fieldname": "nome",
        "message": 'O "nome do utente" não pode estar vazio',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "uten_memb",
        "message": 'O "número de membros" não tem o formato correcto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "uten_mulh",
        "message": 'O "Número de mulheres" não tem o formato correcto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "bi_d_emis",
        "message": 'A "data de emissão" não tem o formato correcto',
        "rules": ["IS_DATE"],
    },
]
