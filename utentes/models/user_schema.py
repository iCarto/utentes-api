# -*- coding: utf-8 -*-

USER_SCHEMA = [
    {
        "fieldname": "username",
        "message": u"Nome de utilizador não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "password",
        "message": u"Password não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "usergroup",
        "message": u"Departamento não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
]
