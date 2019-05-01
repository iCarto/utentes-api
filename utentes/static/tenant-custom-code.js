window.SIXHIARA = {};

window.SIXHIARA.GROUPS_TO_ROLES = {};
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.SINGLE] = [SIRHA.ROLE.SINGLE, SIRHA.ROLE.ADMIN];
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.ADMIN] = [SIRHA.ROLE.ADMIN];
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.ADMINISTRATIVO] = [SIRHA.ROLE.ADMINISTRATIVO];
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.FINANCIERO] = [SIRHA.ROLE.FINANCIERO];
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.DIRECCION] = [SIRHA.ROLE.DIRECCION];
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.TECNICO] = [SIRHA.ROLE.TECNICO];
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.JURIDICO] = [SIRHA.ROLE.JURIDICO];
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.OBSERVADOR] = [SIRHA.ROLE.OBSERVADOR];
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.UNIDAD] = [SIRHA.ROLE.UNIDAD, SIRHA.ROLE.OBSERVADOR];


window.SIXHIARA.ESTADOS_PENDENTES = [
    {
        'key': SIRHA.ESTADO.NOT_EXISTS,
        'roles': [],
    },
    {
        'key': SIRHA.ESTADO.NOT_APPROVED,
        'roles': [],
    },
    {
        'key': SIRHA.ESTADO.IRREGULAR,
        'roles': []
    },
    {
        'key': SIRHA.ESTADO.LICENSED,
        'roles': []
    },
    {
        'key': SIRHA.ESTADO.UNKNOWN,
        'roles': []
    },
    {
        'key': SIRHA.ESTADO.INCOMPLETE_DA,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.ADMINISTRATIVO]
    },
    {
        'key': SIRHA.ESTADO.INCOMPLETE_DIR,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.DIRECCION]
    },
    {
        'key': SIRHA.ESTADO.INCOMPLETE_DJ,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.JURIDICO, SIRHA.ROLE.TECNICO]
    },
    {
        'key': SIRHA.ESTADO.INCOMPLETE_DT,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.TECNICO]
    },
    {
        'key': SIRHA.ESTADO.INCOMPLETE_DF,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.FINANCIERO]
    },
    {
        'key': SIRHA.ESTADO.PENDING_REVIEW_DIR,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.DIRECCION]
    },
    {
        'key': SIRHA.ESTADO.PENDING_REVIEW_DJ,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.TECNICO, SIRHA.ROLE.JURIDICO]
    },
    {
        'key': SIRHA.ESTADO.PENDING_FIELD_VISIT,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.TECNICO, SIRHA.ROLE.UNIDAD]
    },
    {
        'key': SIRHA.ESTADO.PENDING_TECH_DECISION,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.TECNICO]
    },
    {
        'key': SIRHA.ESTADO.PENDING_EMIT_LICENSE,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.JURIDICO]
    },
    {
        'key': SIRHA.ESTADO.PENDING_DIR_SIGN,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.DIRECCION]
    },
    {
        'key': SIRHA.ESTADO.DE_FACTO,
        'roles': []
    },
];

window.SIXHIARA.ESTADOS_RENOVACAO = [
    {
        'key': SIRHA.ESTADO_RENOVACAO.NOT_APPROVED,
        'roles': [SIRHA.ROLE.SINGLE],
    },
    {
        'key': SIRHA.ESTADO_RENOVACAO.IRREGULAR,
        'roles': [SIRHA.ROLE.SINGLE]
    },
    {
        'key': SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DA,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.ADMINISTRATIVO]
    },
    {
        'key': SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DIR,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.DIRECCION]
    },
    {
        'key': SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DJ,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.JURIDICO, SIRHA.ROLE.TECNICO, SIRHA.ROLE.UNIDAD]
    },
    {
        'key': SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DT,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.TECNICO, SIRHA.ROLE.UNIDAD]
    },
    {
        'key': SIRHA.ESTADO_RENOVACAO.PENDING_RENOV_LICENSE,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.ADMINISTRATIVO]
    },
    {
        'key': SIRHA.ESTADO_RENOVACAO.PENDING_REVIEW_DIR,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.DIRECCION]
    },
    {
        'key': SIRHA.ESTADO_RENOVACAO.PENDING_REVIEW_DJ,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.TECNICO, SIRHA.ROLE.JURIDICO, SIRHA.ROLE.UNIDAD]
    },
    {
        'key': SIRHA.ESTADO_RENOVACAO.PENDING_TECH_DECISION,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.TECNICO, SIRHA.ROLE.UNIDAD]
    },
    {
        'key': SIRHA.ESTADO_RENOVACAO.PENDING_EMIT_LICENSE,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.JURIDICO]
    },
    {
        'key': SIRHA.ESTADO_RENOVACAO.PENDING_DIR_SIGN,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.DIRECCION, SIRHA.ROLE.JURIDICO]
    },
    {
        'key': SIRHA.ESTADO_RENOVACAO.DE_FACTO,
        'roles': []
    },
    {
        'key': SIRHA.ESTADO_RENOVACAO.PENDING_DADOS_LICENSE,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.JURIDICO]
    },
];

window.SIXHIARA.ESTADOS_FACT = [
    {
        'key': window.SIRHA.ESTADO_FACT.NO,
        'roles': [],
    },
    {
        'key': window.SIRHA.ESTADO_FACT.PAYED,
        'roles': [],
    },
    {
        'key': window.SIRHA.ESTADO_FACT.PENDING_PAY,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.FINANCIERO]
    },
    {
        'key': window.SIRHA.ESTADO_FACT.PENDIND_INVOICE,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.FINANCIERO]
    },
    {
        'key': window.SIRHA.ESTADO_FACT.PENDING_M3,
        'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.TECNICO, SIRHA.ROLE.UNIDAD]
    }
];

window.SIXHIARA.IVA = 17;

if (window.SIRHA.getARA() === 'DPMAIP') {
    Object.assign(SIXHIARA, {
        center: [-12.5, 39.0],
        southWest: [-23, 31],
        northEast: [-9, 48],
        search: {
          zoom: 8,
        },
    });
}

if (window.SIRHA.getARA() === 'ARAN') {
    Object.assign(SIXHIARA, {
        center: [-13, 38.5050],
        southWest: [-23, 31],
        northEast: [-9, 43],
        search: {
          zoom: 8,
        },
    });
}

if (window.SIRHA.getARA() === 'ARAS') {
    Object.assign(SIXHIARA, {
        center: [-22.6, 33.8],
        southWest: [-29, 22],
        northEast: [-8, 48],
        search: {
          zoom: 7,
        },
    });
    window.SIXHIARA.IVA = 12.75;
    window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.JURIDICO] = [SIRHA.ROLE.JURIDICO, SIRHA.ROLE.DIRECCION];
}

if (window.SIRHA.getARA() === 'ARAZ') {
    Object.assign(SIXHIARA, {
        center: [-16, 34.63],
        southWest: [-28.3, -6.76],
        northEast: [3, 77],
        search: {
          zoom: 7,
        },
    });

    window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.JURIDICO] = [SIRHA.ROLE.JURIDICO, SIRHA.ROLE.ADMINISTRATIVO, SIRHA.ROLE.DIRECCION];
}

window.SIXHIARA.xlsFieldsToExport = {};
if (window.SIRHA.getARA() === 'DPMAIP') {
    window.SIXHIARA.xlsFieldsToExport.exploracaos = [
        {'header': 'Nome utente', 'value': 'utente.nome'},
        {'header': 'Nuit', 'value': 'utente.nuit'},
        {'header': 'Tipo de utente', 'value': 'utente.uten_tipo'},
        {'header': 'Nro de membros', 'value': 'utente.uten_memb'},
        {'header': 'Nro de mulheres', 'value': 'utente.uten_mulh'},
        {'header': 'Nro registro comercial', 'value': 'utente.reg_comerc'},
        {'header': 'Registrado em', 'value': 'utente.reg_zona'},
        {'header': 'Provincia', 'value': 'utente.loc_provin'},
        {'header': 'Distrito', 'value': 'utente.loc_distri'},
        {'header': 'Posto administrativo', 'value': 'utente.loc_posto'},
        {'header': 'Bairro', 'value': 'utente.loc_nucleo'},
        {'header': 'Endereço', 'value': 'utente.loc_endere'},
        {'header': 'Observações', 'value': 'utente.observacio'},
        {'header': 'Nro da exploração', 'value': 'exp_id'},
        {'header': 'Nome da exploração', 'value': 'exp_name'},
        {'header': 'Consumo mensal licença Total', 'value': 'c_licencia'},
        {'header': 'Consumo mensal solicitado Total', 'value': 'c_soli'},
        {'header': 'Área de exploração (ha)', 'value': 'actividade.area_pisc'},
        {'header': 'Ano inicio da atividade', 'value': 'actividade.ano_i_ati'},
        {'header': 'Nro de tanques/gaiolas', 'value': 'actividade.n_tanques'},
        {'header': 'Volume total tanques/gaiolas (reservas)', 'value': 'actividade.vol_tot_t'},
        {'header': 'Nro de alevinos povoados', 'value': 'actividade.n_ale_pov'},
        {'header': 'Produção Anual (kg)', 'value': 'actividade.produc_pi'},
        {'header': 'Processamento do peixe', 'value': 'actividade.tipo_proc'},
        {'header': 'Tratamento da água que entra nos tanques', 'value': 'actividade.trat_t_en'},
        {'header': 'Tratamento da água que sai dos tanques', 'value': 'actividade.trat_a_sa'},
        {'header': 'As gaiolas estão submersas em', 'value': 'actividade.gaio_subm'},
        {'header': 'A exploraçaõ tem problemas', 'value': 'actividade.problemas'},
        {'header': 'Principais problemas', 'value': 'actividade.prob_prin'},
    ];

    window.SIXHIARA.xlsFieldsToExport.tanques = [
        {'header':'Nome utente', 'value': 'utente'},
        {'header':'Nro da exploração', 'value':'exp_id'},
        {'header':'Id Tanque', 'value':'tanque_id'},
        {'header':'Tipo ', 'value':'tipo'},
        {'header':'Comprimento (m)', 'value':'cumprimen'},
        {'header':'Largura (m)', 'value':'largura'},
        {'header':'Profundidade (m)', 'value':'profundid'},
        {'header':'Área (m2)', 'value':'area'},
        {'header':'Área GPS (m2)', 'value':'area_gps'},
        {'header':'Volume (m3)', 'value':'volume'},
        {'header':'Estado', 'value':'estado'},
        {'header':'Espécie cultivada', 'value':'esp_culti'},
        {'header':'Espécie cultivada (outros)', 'value':'esp_cul_o'},
        {'header':'Tipo de alimentação', 'value':'tipo_alim'},
        {'header':'Tipo de alimenção (outros)', 'value':'tipo_al_o'},
        {'header':'Nro de alevinos povoados', 'value':'n_ale_pov'},
        {'header':'Proveniência dos alevinos', 'value':'prov_alev'},
        {'header':'Proveniência dos alevinos (outros)', 'value':'prov_al_o'},
        {'header':'Venda (Kg)', 'value':'venda'},
        {'header':'Consumo', 'value':'consumo'},
        {'header':'Produção anual (Kg)', 'value':'pro_anual'},
        {'header':'Peso médio final dos peixes (g)', 'value':'peso_med'},
        {'header':'Fertilização da água', 'value':'fert_agua'},
    ];


    window.SIXHIARA.shpFieldsToExport = [
        { 'header': 'exp_id', 'value': 'exp_id' },
        { 'header': 'exp_name', 'value': 'exp_name' },
        { 'header': 'loc_provin', 'value': 'loc_provin' },
        { 'header': 'loc_distri', 'value': 'loc_distri' },
        { 'header': 'loc_posto', 'value': 'loc_posto' },
        { 'header': 'loc_nucleo', 'value': 'loc_nucleo' },
        { 'header': 'loc_endere', 'value': 'loc_endere' },
        { 'header': 'loc_bacia', 'value': 'loc_bacia' },
        { 'header': 'loc_subaci', 'value': 'loc_subaci' },
        { 'header': 'loc_rio', 'value': 'loc_rio' },
        { 'header': 'utente', 'value': 'utente.nome' },
        { 'header': 'uten_nuit', 'value': 'utente.nuit' },
        { 'header': 'con_l_to', 'value': 'c_licencia' },
        { 'header': 'tipo_subt',
        'value': function (exp) {
            var lic = exp.licencias.filter( lic => lic.tipo_agua == 'Subterrânea' );
            return lic.length > 0;
        }
        },
        { 'header': 'con_l_sb',
        'value': function (exp) {
            var lic = exp.licencias.filter( lic => lic.tipo_agua == 'Subterrânea' );
            return (lic[0] && lic[0].c_licencia) || null;
        }
        },
        { 'header': 'tipo_supe',
        'value': function (exp) {
            var lic = exp.licencias.filter( lic => lic.tipo_agua == 'Superficial' );
            return lic.length > 0;
        }
        },
        { 'header': 'con_l_su',
        'value': function (exp) {
            var lic = exp.licencias.filter( lic => lic.tipo_agua == 'Superficial' );
            return (lic[0] && lic[0].c_licencia) || null;
        }
        },
        { 'header': 'observacio', 'value': 'observacio' },
        {'header': 'area_pisc', 'value': 'actividade.area_pisc'},
        {'header': 'ano_i_ati', 'value': 'actividade.ano_i_ati'},
        {'header': 'n_tanques', 'value': 'actividade.n_tanques'},
        {'header': 'vol_tot_t', 'value': 'actividade.vol_tot_t'},
        {'header': 'n_ale_pov', 'value': 'actividade.n_ale_pov'},
        {'header': 'produc_pi', 'value': 'actividade.produc_pi'},
        {'header': 'tipo_proc', 'value': 'actividade.tipo_proc'},
        {'header': 'asis_aber', 'value': 'actividade.asis_aber'},
        {'header': 'asis_moni', 'value': 'actividade.asis_moni'},
        {'header': 'trat_t_en', 'value': 'actividade.trat_t_en'},
        {'header': 'trat_a_sa', 'value': 'actividade.trat_a_sa'},
        {'header': 'gaio_subm', 'value': 'actividade.gaio_subm'},
        {'header': 'problemas', 'value': 'actividade.problemas'},
        {'header': 'prob_prin', 'value': 'actividade.prob_prin'},
    ]
} else {

    window.SIXHIARA.xlsFieldsToExport.exploracaos = [
        {'header': 'Nome Utente', 'value': 'utente.nome'},
        {'header': 'Tipo Utente', 'value': 'utente.uten_tipo'},
        {'header': 'Email Utente', 'value': 'utente.email'},
        {'header': 'Telefone Utente', 'value': 'utente.telefone'},
        {'header': 'Nro Exploração', 'value': 'exp_id'},
        {'header': 'Nome Exploração', 'value': 'exp_name'},
        {
            'header': 'Ano',
            'value': function (exp) {
                return exp.exp_id.split('/')[2];
            }
        },
        {'header': 'Província', 'value': 'utente.loc_provin'},
        {'header': 'Distrito', 'value': 'utente.loc_distri'},
        {'header': 'Posto administrativo', 'value': 'utente.loc_posto'},
        {'header': 'Unidade', 'value': 'loc_unidad'},
        {'header': 'Bacia', 'value': 'loc_bacia' },
        {
            'header': 'Tipo de água',
            'value': function (exp) {
                var licSubterranea = exp.licencias.filter( lic => lic.tipo_agua == 'Subterrânea' ).length;
                var licSuperficial = exp.licencias.filter( lic => lic.tipo_agua == 'Superficial' ).length;
                if(licSubterranea && licSuperficial) {
                    return 'Ambas';
                } else if(licSubterranea) {
                    return 'Subterrânea';
                } else if(licSuperficial) {
                    return 'Superficial';
                } else {
                    return '';
                }
            }
        },
        {
            'header': 'Nro Licença Sub.',
            'value': function (exp) {
                var lic = exp.licencias.filter( lic => lic.tipo_agua == 'Subterrânea' );
                return (lic[0] && lic[0].lic_nro) || null;
            }
        },
        {
            'header': 'Estado Licencia Sub.',
            'value': function (exp) {
                var lic = exp.licencias.filter( lic => lic.tipo_agua == 'Subterrânea' );
                return (lic[0] && lic[0].estado) || null;
            }
        },
        {
            'header': 'Tipo Licença Sub.',
            'value': function (exp) {
                var lic = exp.licencias.filter( lic => lic.tipo_agua == 'Subterrânea' );
                return (lic[0] && lic[0].tipo_lic) || null;
            }
        },
        {
            'header': 'Nro Licença Sup.',
            'value': function (exp) {
                var lic = exp.licencias.filter( lic => lic.tipo_agua == 'Superficial' );
                return (lic[0] && lic[0].lic_nro) || null;
            }
        },
        {
            'header': 'Estado Licencia Sup.',
            'value': function (exp) {
                var lic = exp.licencias.filter( lic => lic.tipo_agua == 'Superficial' );
                return (lic[0] && lic[0].estado) || null;
            }
        },
        {
            'header': 'Tipo Licença Sup.',
            'value': function (exp) {
                var lic = exp.licencias.filter( lic => lic.tipo_agua == 'Superficial' );
                return (lic[0] && lic[0].tipo_lic) || null;
            }
        },
        {'header': 'Consumo licenciado (m3/mês)', 'value': 'c_licencia'},
        {
            'header': 'Consumo facturado (m3/mês)',
            'value': function(exp) {
                return exp.licencias.reduce(
                    (accumulator, lic) => accumulator + lic.consumo_fact,
                0);
            }
        },
        {
            'header': 'Valor com IVA (MZN/mês)',
            'value': function(exp) {
                return exp.licencias.reduce(
                    (accumulator, lic) => accumulator + lic.pago_iva,
                0);
            }
        },
    ];

    window.SIXHIARA.shpFieldsToExport = [
        { 'header': 'exp_id', 'value': 'exp_id' },
        { 'header': 'exp_name', 'value': 'exp_name' },
        { 'header': 'd_soli', 'value': 'd_soli' },
        { 'header': 'loc_provin', 'value': 'loc_provin' },
        { 'header': 'loc_distri', 'value': 'loc_distri' },
        { 'header': 'loc_posto', 'value': 'loc_posto' },
        { 'header': 'loc_nucleo', 'value': 'loc_nucleo' },
        { 'header': 'loc_endere', 'value': 'loc_endere' },
        { 'header': 'loc_bacia', 'value': 'loc_bacia' },
        { 'header': 'loc_subaci', 'value': 'loc_subaci' },
        { 'header': 'loc_rio', 'value': 'loc_rio' },
        { 'header': 'utente', 'value': 'utente.nome' },
        { 'header': 'uten_nuit', 'value': 'utente.nuit' },
        { 'header': 'abastecem',
        'value': function (exp) { return exp.actividade ? exp.actividade.tipo === 'Abastecimento' : false; }
        },
        { 'header': 'saneament',
        'value': function (exp) { return exp.actividade ? exp.actividade.tipo === 'Saneamento' : false; }
        },
        { 'header': 'agricultu',
        'value': function (exp) { return exp.actividade ? exp.actividade.tipo === 'Agricultura de Regadio' : false; }
        },
        { 'header': 'pecuaria',
        'value': function (exp) { return exp.actividade ? exp.actividade.tipo === 'Pecuária' : false;}
        },
        { 'header': 'piscicult',
        'value': function (exp) { return exp.actividade ? exp.actividade.tipo === 'Piscicultura' : false;}
        },
        { 'header': 'industria',
        'value': function (exp) { return exp.actividade ? exp.actividade.tipo === 'Indústria' : false;}
        },
        { 'header': 'pro_energ',
        'value': function (exp) { return exp.actividade ? exp.actividade.tipo === 'Producção de energia' : false; }
        },
        { 'header': 'con_l_to', 'value': 'c_licencia' },
        { 'header': 'tipo_subt',
        'value': function (exp) {
            var lic = exp.licencias.filter( lic => lic.tipo_agua == 'Subterrânea' );
            return lic.length > 0;
        }
        },
        { 'header': 'con_l_sb',
        'value': function (exp) {
            var lic = exp.licencias.filter( lic => lic.tipo_agua == 'Subterrânea' );
            return (lic[0] && lic[0].c_licencia) || null;
        }
        },
        { 'header': 'est_l_sb',
        'value': function (exp) {
            var lic = exp.licencias.filter( lic => lic.tipo_agua == 'Subterrânea' );
            return (lic[0] && lic[0].estado) || null;
        }
        },
        { 'header': 'tipo_supe',
        'value': function (exp) {
            var lic = exp.licencias.filter( lic => lic.tipo_agua == 'Superficial' );
            return lic.length > 0;
        }
        },
        { 'header': 'con_l_su',
        'value': function (exp) {
            var lic = exp.licencias.filter( lic => lic.tipo_agua == 'Superficial' );
            return (lic[0] && lic[0].c_licencia) || null;
        }
        },
        { 'header': 'est_l_su',
        'value': function (exp) {
            var lic = exp.licencias.filter( lic => lic.tipo_agua == 'Superficial' );
            return (lic[0] && lic[0].estado) || null;
        }
        },
        { 'header': 'pagamento',
        'value': function (exp) {
            var pagamento = 'No';
            if (_.isNull(exp.pagos)){
                pagamento = null;
            } else if (exp.pagos === true) {
                pagamento = 'Si';
            }
            return pagamento;
        }
        },
        { 'header': 'observacio', 'value': 'observacio' },
    ]
}
