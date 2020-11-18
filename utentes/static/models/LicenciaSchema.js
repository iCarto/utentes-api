var LICENCIA_SCHEMA = [
    {
        fieldname: "tipo_agua",
        message: 'O "tipo de água" não pode estar vazio',
        rules: ["NOT_NULL"],
    },
    {
        fieldname: "lic_nro",
        message: 'O "Número de licença" não tem o formato correcto',
        rules: ["LIC_NRO_FORMAT"],
    },
    {
        fieldname: "estado",
        message: "A licença deve ter um estado",
        rules: ["NOT_NULL"],
    },
    {
        fieldname: "d_emissao",
        message: 'A "data de emissão" não tem o formato correcto',
        rules: ["IS_DATE"],
    },
    {
        fieldname: "d_validade",
        message: 'A "data de validade" não tem o formato correcto',
        rules: ["IS_DATE"],
    },
    {
        fieldname: "c_soli_tot",
        message: 'O "consumo solicitado" da licença não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        fieldname: "c_soli_int",
        message:
            'O "consumo solicitado intermedio" da licença não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        fieldname: "c_soli_fon",
        message: 'O "consumo solicitado" das fontes não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        fieldname: "c_licencia",
        message: 'O "consumo licenciado" não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        fieldname: "c_real_tot",
        message: 'O "consumo real" não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        fieldname: "c_real_int",
        message: 'O "consumo real intermedio" não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        fieldname: "c_real_fon",
        message: 'O "consumo real" das fontes não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        fieldname: "taxa_fixa",
        message: 'A "taxa fixa" da licença não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        fieldname: "taxa_uso",
        message: 'A "taxa de uso" da licença não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        fieldname: "pago_mes",
        message: 'O "valor de pago mensal" da licença não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        fieldname: "iva",
        message: 'O "IVA" da licença não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        fieldname: "pago_iva",
        message: 'O "valor com IVA" da licença não tem o formato correcto',
        rules: ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        fieldname: "consumo_tipo",
        message: 'O "tipo de consumo" é obligatorio',
        rules: ["NOT_NULL"],
    },
];
