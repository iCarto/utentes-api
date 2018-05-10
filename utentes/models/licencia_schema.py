# -*- coding: utf-8 -*-

LICENCIA_SCHEMA = [{
    'fieldname': 'tipo_agua',
    'message': 'Tipo de agua não pode estar vazio',
    'rules': ['NOT_NULL']
}, {
    'fieldname': 'tipo_lic',
    'message': 'Tipo de licença não pode estar vazio',
    'rules': ['NOT_NULL']
}, {
    'fieldname': 'lic_nro',
    'message': 'Nro de licença não tem o formato correto',
    'rules': ['LIC_NRO_FORMAT']
}, {
    'fieldname': 'estado',
    'message': 'A licença debe ter um estado',
    'rules': ['NOT_NULL']
}, {
    'fieldname': 'd_emissao',
    'message': 'Data emissão não tem o formato correto',
    'rules': ['IS_DATE']
}, {
    'fieldname': 'd_validade',
    'message': 'Data validade não tem o formato correto',
    'rules': ['IS_DATE']
}, {
    'fieldname': 'c_soli_tot',
    'message': 'O consumo solicitado da licença não tem o formato correto',
    'rules': ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'c_soli_int',
    'message': 'Consumo solicitado intermedio da licença não tem o formato correto',
    'rules': ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'c_soli_fon',
    'message': 'Consumo solicitado das fontes não tem o formato correto',
    'rules': ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'c_licencia',
    'message': 'Consumo licenciado não tem o formato correto',
    'rules': ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'c_real_tot',
    'message': 'Consumo real não tem o formato correto',
    'rules': ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'c_real_int',
    'message': 'Consumo real intermedio não tem o formato correto',
    'rules': ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'c_real_fon',
    'message': 'Consumo real das fontes não tem o formato correto',
    'rules': ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'taxa_fixa',
    'message': 'Taxa fixa da licença não tem o formato correto',
    'rules': ['NOT_NULL', 'IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'taxa_uso',
    'message': 'Taxa de uso da licença não tem o formato correto',
    'rules': ['NOT_NULL', 'IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'pago_mes',
    'message': 'Valor pago mensual da licença não tem o formato correto',
    'rules': ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'iva',
    'message': 'IVA da licença não tem o formato correto',
    'rules': ['NOT_NULL', 'IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'pago_iva',
    'message': 'Valor com IVA da licença não tem o formato correto',
    'rules': ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'consumo_tipo',
    'message':   'O tipo de consumo é obligatorio',
    'rules':     ['NOT_NULL']
}
]
