window.FONTE_SCHEMA = [
    {
        fieldname: "tipo_agua",
        message: 'O "tipo de água" não pode estar vazio',
        rules: ["NOT_NULL"],
    },
    {
        fieldname: "red_monit",
        message: 'A "rede de monitoramento" não pode estar vazia',
        rules: ["NOT_NULL"],
    },
    {
        fieldname: "d_dado",
        message: 'A "data de toma de dados" não tem o formato correcto',
        rules: ["IS_DATE"],
    },
    {
        fieldname: "c_soli",
        message: 'O "consumo solicitado" não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        fieldname: "c_max",
        message: 'O "máximo caudal extraível" não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        fieldname: "prof_pozo",
        message: 'A "profundidade (m)" não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        fieldname: "diametro",
        message: 'O "diâmetro interior (m)" não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        fieldname: "c_real",
        message: 'O "consumo real" não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
];
