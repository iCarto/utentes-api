import utentes.models.constants as c


ActividadeSchema = {}

ActividadeSchema[c.K_ABASTECIMENTO] = [
    {
        "fieldname": "tipo",
        "message": "Tipo de actividade não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": "Consumo estimado da actividade não tem o formato correto o está vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
    {
        "fieldname": "habitantes",
        "message": "O nro de habitantes da actividade não tem o formato correto o está vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
    {
        "fieldname": "dotacao",
        "message": "A dotaçâo da actividade não tem o formato correto o está vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
]

ActividadeSchema[c.K_AGRICULTURA] = [
    {
        "fieldname": "tipo",
        "message": "Tipo de actividade não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": "Consumo estimado da actividade não tem o formato correto o está vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
    {
        "fieldname": "n_cul_tot",
        "message": '"Número de culturas" da actividade não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area_pot",
        "message": '"Área potencial" da actividade não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area_irri",
        "message": '"Área Irrigada" da actividade não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area_medi",
        "message": '"Área medida" da actividade não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema["Cultivos"] = [
    {
        "fieldname": "c_estimado",
        "message": "Consumo estimado da cultura não tem o formato correto o está vazio",
        "rules": ["NOT_NULL", "IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "cultivo",
        "message": "Tipo de cultura não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "rega",
        "message": "Tipo de rega não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "eficiencia",
        "message": "Eficiencia não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area",
        "message": "Área não tem o formato correto o está vazio",
        "rules": ["NOT_NULL", "IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema[c.K_INDUSTRIA] = [
    {
        "fieldname": "tipo",
        "message": "Tipo de actividade não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": "Consumo estimado da actividade não tem o formato correto o está vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
    {
        "fieldname": "eval_impac",
        "message": "Evaluação impacto não tem o formato correto",
        "rules": ["IS_BOOLEAN"],
    },
]

ActividadeSchema[c.K_PECUARIA] = [
    {
        "fieldname": "tipo",
        "message": "Tipo de actividade não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": "Consumo estimado da actividade não tem o formato correto o está vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
    {
        "fieldname": "n_res_tot",
        "message": '"Nro de reses total" da actividade não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema["Reses"] = [
    {
        "fieldname": "c_estimado",
        "message": "Consumo estimado da actividade não tem o formato correto o está vazio",
        "rules": ["NOT_NULL", "IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "reses_tipo",
        "message": "Tipo de reses não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "reses_nro",
        "message": "Nro de reses não tem o formato correto o está vazio",
        "rules": ["NOT_NULL", "IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "c_res",
        "message": "Consumo por res não tem o formato correto o está vazio",
        "rules": ["NOT_NULL", "IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema[c.K_PISCICULTURA] = [
    {
        "fieldname": "tipo",
        "message": '"Tipo de actividade" não pode estar vazio',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": '"Consumo estimado" da actividade não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area",
        "message": '""Área" não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "ano_i_ati",
        "message": '"Ano inicio da atividade" não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "n_tanques",
        "message": '"Nro de tanques" não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "v_reservas",
        "message": '"Volume total" não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "n_ale_pov",
        "message": '"Nro de alevins por povoar" não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "produc_pi",
        "message": '"Produção Anual" não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema["TanquesPiscicolas"] = [
    {"fieldname": "tipo", "message": '"Tipo" está vazio', "rules": ["NOT_NULL"]},
    {
        "fieldname": "cumprimen",
        "message": '"Comprimento" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "largura",
        "message": '"Largura" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "profundid",
        "message": '"Profundidade" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area",
        "message": '"Área" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area_gps",
        "message": '"Área GPS" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "volume",
        "message": '"Volume" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "esp_culti",
        "message": '"Especie cultivo" está vazio',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "n_ale_pov",
        "message": '"Nro de alevins por povoar" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "venda",
        "message": '"Venda" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "consumo",
        "message": '"Consumo" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "pro_anual",
        "message": '"Produção anual" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "peso_med",
        "message": '"Peso médio" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema[c.K_ENERGIA] = [
    {
        "fieldname": "tipo",
        "message": "Tipo de actividade não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": "Consumo estimado da actividade não tem o formato correto o está vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "alt_agua",
        "message": "Altura de água não pode estar vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "potencia",
        "message": "Potência a instalar não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "eval_impac",
        "message": "Evaluação impacto não tem o formato correto",
        "rules": ["IS_BOOLEAN"],
    },
]

ActividadeSchema[c.K_SANEAMENTO] = [
    {
        "fieldname": "tipo",
        "message": "Tipo de actividade não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": "Consumo estimado da actividade não tem o formato correto o está vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "habitantes",
        "message": "O nro de habitantes da actividade não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]
