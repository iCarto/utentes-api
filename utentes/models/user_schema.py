# -*- coding: utf-8 -*-

USER_SCHEMA = [{
    'fieldname': 'username',
    'message': 'Nome de utilizador não pode estar vazio',
    'rules': ['NOT_NULL']
}, {
    'fieldname': 'password',
    'message': 'Password não pode estar vazio',
    'rules': ['NOT_NULL']
}, {
    'fieldname': 'usergroup',
    'message': 'Departamento não pode estar vazio',
    'rules': ['NOT_NULL']
}]
