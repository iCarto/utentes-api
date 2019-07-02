# -*- coding: utf-8 -*-

import utentes.models.constants as c


ActividadeSchema = {}

ActividadeSchema[c.K_ABASTECIMENTO] = [
    {
        "fieldname": "tipo",
        "message": u"Tipo de actividade não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": u"Consumo estimado da actividade não tem o formato correto o está vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
    {
        "fieldname": "habitantes",
        "message": u"O nro de habitantes da actividade não tem o formato correto o está vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
    {
        "fieldname": "dotacao",
        "message": u"A dotaçâo da actividade não tem o formato correto o está vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
]

ActividadeSchema[c.K_AGRICULTURA] = [
    {
        "fieldname": "tipo",
        "message": u"Tipo de actividade não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": u"Consumo estimado da actividade não tem o formato correto o está vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
    {
        "fieldname": "n_cul_tot",
        "message": u'"Número de cultivos" da actividade não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area_pot",
        "message": u'"Área potencial" da actividade não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area_irri",
        "message": u'"Área Irrigada" da actividade não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area_medi",
        "message": u'"Área medida" da actividade não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema["Cultivos"] = [
    {
        "fieldname": "c_estimado",
        "message": u"Consumo estimado do cultivo não tem o formato correto o está vazio",
        "rules": ["NOT_NULL", "IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "cultivo",
        "message": u"Tipo de cultivo não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "rega",
        "message": u"Tipo de rega não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "eficiencia",
        "message": u"Eficiencia não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area",
        "message": u"Área não tem o formato correto o está vazio",
        "rules": ["NOT_NULL", "IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema[c.K_INDUSTRIA] = [
    {
        "fieldname": "tipo",
        "message": u"Tipo de actividade não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": u"Consumo estimado da actividade não tem o formato correto o está vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
    {
        "fieldname": "eval_impac",
        "message": u"Evaluação impacto não tem o formato correto",
        "rules": ["IS_BOOLEAN"],
    },
]

ActividadeSchema[c.K_PECUARIA] = [
    {
        "fieldname": "tipo",
        "message": u"Tipo de actividade não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": u"Consumo estimado da actividade não tem o formato correto o está vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8", "NOT_NULL"],
    },
    {
        "fieldname": "n_res_tot",
        "message": u'"Nro de reses total" da actividade não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema["Reses"] = [
    {
        "fieldname": "c_estimado",
        "message": u"Consumo estimado da actividade não tem o formato correto o está vazio",
        "rules": ["NOT_NULL", "IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "reses_tipo",
        "message": u"Tipo de reses não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "reses_nro",
        "message": u"Nro de reses não tem o formato correto o está vazio",
        "rules": ["NOT_NULL", "IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "c_res",
        "message": u"Consumo por res não tem o formato correto o está vazio",
        "rules": ["NOT_NULL", "IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema[c.K_PISCICULTURA] = [
    {
        "fieldname": "tipo",
        "message": u'"Tipo de actividade" não pode estar vazio',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": u'"Consumo estimado" da actividade não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area",
        "message": u'""Área" não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "ano_i_ati",
        "message": u'"Ano inicio da atividade" não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "n_tanques",
        "message": u'"Nro de tanques" não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "v_reservas",
        "message": u'"Volume total" não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "n_ale_pov",
        "message": u'"Nro de alevins por povoar" não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "produc_pi",
        "message": u'"Produção Anual" não tem o formato correto',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema["TanquesPiscicolas"] = [
    {"fieldname": "tipo", "message": '"Tipo" está vazio', "rules": ["NOT_NULL"]},
    {
        "fieldname": "cumprimen",
        "message": u'"Comprimento" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "largura",
        "message": u'"Largura" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "profundid",
        "message": u'"Profundidade" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area",
        "message": u'"Área" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "area_gps",
        "message": u'"Área GPS" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "volume",
        "message": u'"Volume" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "esp_culti",
        "message": u'"Especie cultivo" está vazio',
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "n_ale_pov",
        "message": u'"Nro de alevins por povoar" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "venda",
        "message": u'"Venda" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "consumo",
        "message": u'"Consumo" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "pro_anual",
        "message": u'"Produção anual" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "peso_med",
        "message": u'"Peso médio" não tem o formato correto o está vazio',
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]

ActividadeSchema[c.K_ENERGIA] = [
    {
        "fieldname": "tipo",
        "message": u"Tipo de actividade não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": u"Consumo estimado da actividade não tem o formato correto o está vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "alt_agua",
        "message": u"Altura de água não pode estar vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "potencia",
        "message": u"Potência a instalar não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "eval_impac",
        "message": u"Evaluação impacto não tem o formato correto",
        "rules": ["IS_BOOLEAN"],
    },
]

ActividadeSchema[c.K_SANEAMENTO] = [
    {
        "fieldname": "tipo",
        "message": u"Tipo de actividade não pode estar vazio",
        "rules": ["NOT_NULL"],
    },
    {
        "fieldname": "c_estimado",
        "message": u"Consumo estimado da actividade não tem o formato correto o está vazio",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
    {
        "fieldname": "habitantes",
        "message": u"O nro de habitantes da actividade não tem o formato correto",
        "rules": ["IS_NUMERIC", "INT_LESS_THAN_8"],
    },
]
