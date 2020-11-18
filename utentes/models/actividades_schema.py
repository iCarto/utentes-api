import utentes.models.constants as c


ActividadeSchema = {}

ActividadeSchema[c.K_ABASTECIMENTO] = [
    {
        "fieldname": "tipo",
        "message": 'O "tipo de actividade não pode estar vazio',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": 'O "consumo estimado" da actividade não tem o formato correcto ou está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
    {
        "fieldname": "habitantes",
        "message": 'O "número de habitantes" da actividade não tem o formato correcto ou está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
    {
        "fieldname": "dotacao",
        "message": 'A "dotaçâo" da actividade não tem o formato correcto ou está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
]

ActividadeSchema[c.K_AGRICULTURA] = [
    {
        "fieldname": "tipo",
        "message": 'O "tipo de actividade" não pode estar vazio',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": 'O "consumo estimado" da actividade não tem o formato correcto ou está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
    {
        "fieldname": "n_cul_tot",
        "message": 'O "número de culturas" da actividade não tem o formato correcto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area_pot",
        "message": 'A "área potencial" da actividade não tem o formato correcto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area_irri",
        "message": 'A "área irrigada" da actividade não tem o formato correcto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area_medi",
        "message": 'A "área medida" da actividade não tem o formato correcto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema["Cultivos"] = [
    {
        "fieldname": "c_estimado",
        "message": 'O "consumo estimado" da cultura não tem o formato correcto ou está vazio',
        "rules": ["NOT_NULL", "IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "cultivo",
        "message": 'O "tipo de cultura" não pode estar vazio',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "rega",
        "message": 'O "tipo de rega" não pode estar vazio',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "eficiencia",
        "message": 'A "eficiência da rega" não tem o formato correcto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area",
        "message": 'A "área" não tem o formato correcto ou está vazia',
        "rules": ["NOT_NULL", "IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema[c.K_INDUSTRIA] = [
    {
        "fieldname": "tipo",
        "message": 'O "tipo de actividade" não pode estar vazio',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": 'O "consumo estimado" da actividade não tem o formato correcto ou está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
    {
        "fieldname": "eval_impac",
        "message": 'A "evaluação de Impacto Ambiental" não tem o formato correcto',
        "rules": ["IS_BOOLEAN"],
    },
]

ActividadeSchema[c.K_PECUARIA] = [
    {
        "fieldname": "tipo",
        "message": 'O "tipo de actividade" não pode estar vazio',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": 'O "consumo estimado" da actividade não tem o formato correcto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
    {
        "fieldname": "n_res_tot",
        "message": 'O "número de reses total" da actividade não tem o formato correcto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema["Reses"] = [
    {
        "fieldname": "c_estimado",
        "message": 'O "consumo estimado" da actividade não tem o formato correcto ou está vazio',
        "rules": ["NOT_NULL", "IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "reses_tipo",
        "message": 'O "tipo de reses" não pode estar vazio',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "reses_nro",
        "message": 'O "número de reses" não tem o formato correcto ou está vazio',
        "rules": ["NOT_NULL", "IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "c_res",
        "message": 'O "consumo por res" não tem o formato correcto ou está vazio',
        "rules": ["NOT_NULL", "IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema[c.K_PISCICULTURA] = [
    {
        "fieldname": "tipo",
        "message": 'O "tipo de actividade" não pode estar vazio',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": 'O "consumo estimado" da actividade não tem o formato correcto ou está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area",
        "message": 'A "área" não tem o formato correcto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "ano_i_ati",
        "message": 'O "ano de inicio da actividade" não tem o formato correcto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "n_tanques",
        "message": 'O "número de tanques" não tem o formato correcto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "v_reservas",
        "message": 'O "volume total" não tem o formato correcto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "n_ale_pov",
        "message": 'O "número de alevins por povoar" não tem o formato correcto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "produc_pi",
        "message": 'A "producção anual" não tem o formato correcto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema["TanquesPiscicolas"] = [
    {"fieldname": "tipo", "message": '"Tipo" está vazio', "rules": ["NOT_NULL"]},
    {
        "fieldname": "cumprimen",
        "message": 'O "comprimento" não tem o formato correcto ou está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "largura",
        "message": 'A "largura" não tem o formato correcto ou está vazia',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "profundid",
        "message": 'A "profundidade" não tem o formato correcto ou está vazia',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area",
        "message": 'A "área" não tem o formato correcto ou está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area_gps",
        "message": 'A "área GPS" não tem o formato correcto ou está vazia',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "volume",
        "message": 'O "volume" não tem o formato correcto ou está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "esp_culti",
        "message": 'A "especie de cultivo" está vazia',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "n_ale_pov",
        "message": 'O "número de alevins por povoar" não tem o formato correcto ou está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "venda",
        "message": 'A "venda" não tem o formato correcto ou está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "consumo",
        "message": 'O "consumo" não tem o formato correcto ou está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "pro_anual",
        "message": 'A "producção anual" não tem o formato correcto o está vazia',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "peso_med",
        "message": 'O "peso médio" não tem o formato correcto ou está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema[c.K_ENERGIA] = [
    {
        "fieldname": "tipo",
        "message": 'O "tipo de actividade" não pode estar vazio',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": 'O "consumo estimado" da actividade não tem o formato correcto ou está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "alt_agua",
        "message": 'A "altura de água" não pode estar vazia',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "potencia",
        "message": 'A "potência a instalar" não tem o formato correcto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "eval_impac",
        "message": 'A "evaluação de Impacto Ambiental" não tem o formato correcto',
        "rules": ["IS_BOOLEAN"],
    },
]

ActividadeSchema[c.K_SANEAMENTO] = [
    {
        "fieldname": "tipo",
        "message": 'O "tipo de actividade" não pode estar vazio',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": 'O "consumo estimado" da actividade não tem o formato correcto ou está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "habitantes",
        "message": 'O "número de habitantes" da actividade não tem o formato correcto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]
