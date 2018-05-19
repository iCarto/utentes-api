var FONTE_SCHEMA = [{
    'fieldname': 'tipo_agua',
    'message':   'Tipo de água não pode estar vazio',
    'rules':     ['NOT_NULL']
}, {
    'fieldname': 'd_dado',
    'message':   'Data toma de dados não tem o formato correto',
    'rules':     ['IS_DATE']
}, {
    'fieldname': 'c_soli',
    'message':   'Consumo solicitado não tem o formato correto',
    'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'c_max',
    'message':   'Máximo caudal extraíble não tem o formato correto',
    'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}, {
    'fieldname': 'c_real',
    'message':   'Consumo real não tem o formato correto',
    'rules':     ['IS_NUMERIC', 'INT_LESS_THAN_8']
}];
