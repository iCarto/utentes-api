var EXPLORACAO_SCHEMA = [{
    'fieldname': 'exp_id',
    'message':   'Nro de exploracão não pode estar vazio',
    'rules':     ['NOT_NULL']
},{
    'fieldname': 'exp_id',
    'message':   'Nro de exploracão não tem o formato correto',
    'rules':     ['EXP_ID_FORMAT']
}, {
    'fieldname': 'exp_name',
    'message':   'Nome da exploracão não pode estar vazio',
    'rules':     ['NOT_NULL']
}, {
    'fieldname': 'd_soli',
    'message':   'Data de solicitação não tem o formato correto',
    'rules':     ['IS_DATE']
}, {
    'fieldname': 'c_soli',
    'message':   'Consumo solicitado não tem o formato correto',
    'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'c_licencia',
    'message':   'Consumo licenciado não tem o formato correto',
    'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'c_real',
    'message':   'Consumo real não tem o formato correto',
    'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'c_estimado',
    'message':   'Consumo estimado não tem o formato correto',
    'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'area',
    'message':   'Área não tem o formato correto',
    'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}];

EXPLORACAO_SCHEMA_CON_FICHA = [{
    'fieldname': 'loc_provin',
    'message':   'A provincia da exploracão não pode estar vazio',
    'rules':     ['NOT_NULL']
},{
    'fieldname': 'loc_distri',
    'message':   'O distrito da exploracão não pode estar vazio',
    'rules':     ['NOT_NULL']
}, {
    'fieldname': 'loc_posto',
    'message':   'O posto da exploracão não pode estar vazio',
    'rules':     ['NOT_NULL']
}, {
    'fieldname': 'loc_unidad',
    'message':   'A Unidade da exploracão não pode estar vazio',
    'rules':     ['NOT_NULL']
},{
    'fieldname': 'utente',
    'message':   'A exploracão debe ter um utemte',
    'rules':     ['NOT_NULL']
}, {
    'fieldname': 'actividade',
    'message':   'A exploracão debe ter uma actividade',
    'rules':     ['ACTIVITY_NOT_NULL']
}, {
    'fieldname': 'licencias',
    'message':   'A exploracão debe ter uma licença',
    'rules':     ['ARRAY_NOT_VOID']
}];
