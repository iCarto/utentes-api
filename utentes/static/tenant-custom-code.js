window.SIXHIARA = {};

window.SIXHIARA.GROUPS_TO_ROLES = {};
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.SINGLE] = [
    SIRHA.ROLE.SINGLE,
    SIRHA.ROLE.ADMIN,
];
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.ADMIN] = [SIRHA.ROLE.ADMIN];
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.ADMINISTRATIVO] = [
    SIRHA.ROLE.ADMINISTRATIVO,
];
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.FINANCIERO] = [SIRHA.ROLE.FINANCIERO];
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.DIRECCION] = [SIRHA.ROLE.DIRECCION];
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.TECNICO] = [SIRHA.ROLE.TECNICO];
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.JURIDICO] = [SIRHA.ROLE.JURIDICO];
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.OBSERVADOR] = [SIRHA.ROLE.OBSERVADOR];
window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.UNIDAD] = [
    SIRHA.ROLE.UNIDAD,
    SIRHA.ROLE.OBSERVADOR,
];

window.SIXHIARA.ESTADOS_PENDENTES = [
    {
        key: SIRHA.ESTADO.NOT_EXISTS,
        roles: [],
    },
    {
        key: SIRHA.ESTADO.USOS_COMUNS,
        roles: [],
    },
    {
        key: SIRHA.ESTADO.NOT_APPROVED,
        roles: [],
    },
    {
        key: SIRHA.ESTADO.IRREGULAR,
        roles: [],
    },
    {
        key: SIRHA.ESTADO.LICENSED,
        roles: [],
    },
    {
        key: SIRHA.ESTADO.UNKNOWN,
        roles: [],
    },
    {
        key: SIRHA.ESTADO.INCOMPLETE_DA,
        roles: [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.ADMINISTRATIVO],
    },
    {
        key: SIRHA.ESTADO.INCOMPLETE_DIR,
        roles: [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.DIRECCION],
    },
    {
        key: SIRHA.ESTADO.INCOMPLETE_DJ,
        roles: [
            SIRHA.ROLE.ADMIN,
            SIRHA.ROLE.OBSERVADOR,
            SIRHA.ROLE.JURIDICO,
            SIRHA.ROLE.TECNICO,
        ],
    },
    {
        key: SIRHA.ESTADO.INCOMPLETE_DT,
        roles: [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.TECNICO],
    },
    {
        key: SIRHA.ESTADO.INCOMPLETE_DF,
        roles: [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.FINANCIERO],
    },
    {
        key: SIRHA.ESTADO.PENDING_REVIEW_DIR,
        roles: [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.DIRECCION],
    },
    {
        key: SIRHA.ESTADO.PENDING_REVIEW_DJ,
        roles: [
            SIRHA.ROLE.ADMIN,
            SIRHA.ROLE.OBSERVADOR,
            SIRHA.ROLE.TECNICO,
            SIRHA.ROLE.JURIDICO,
        ],
    },
    {
        key: SIRHA.ESTADO.PENDING_FIELD_VISIT,
        roles: [
            SIRHA.ROLE.ADMIN,
            SIRHA.ROLE.OBSERVADOR,
            SIRHA.ROLE.TECNICO,
            SIRHA.ROLE.UNIDAD,
        ],
    },
    {
        key: SIRHA.ESTADO.PENDING_TECH_DECISION,
        roles: [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.TECNICO],
    },
    {
        key: SIRHA.ESTADO.PENDING_EMIT_LICENSE,
        roles: [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.JURIDICO],
    },
    {
        key: SIRHA.ESTADO.PENDING_DIR_SIGN,
        roles: [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.DIRECCION],
    },
    {
        key: SIRHA.ESTADO.DE_FACTO,
        roles: [],
    },
];

window.SIXHIARA.ESTADOS_RENOVACAO = [
    {
        key: SIRHA.ESTADO_RENOVACAO.NOT_APPROVED,
        roles: [SIRHA.ROLE.SINGLE],
    },
    {
        key: SIRHA.ESTADO_RENOVACAO.IRREGULAR,
        roles: [SIRHA.ROLE.SINGLE],
    },
    {
        key: SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DA,
        roles: [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.ADMINISTRATIVO],
        roles_only_read:
            window.SIRHA.getARA() === "ARAS" ? [SIRHA.ROLE.JURIDICO] : undefined,
    },
    {
        key: SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DIR,
        roles: [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.DIRECCION],
    },
    {
        key: SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DJ,
        roles: [
            SIRHA.ROLE.ADMIN,
            SIRHA.ROLE.OBSERVADOR,
            SIRHA.ROLE.JURIDICO,
            SIRHA.ROLE.TECNICO,
            SIRHA.ROLE.UNIDAD,
        ],
    },
    {
        key: SIRHA.ESTADO_RENOVACAO.INCOMPLETE_DT,
        roles: [
            SIRHA.ROLE.ADMIN,
            SIRHA.ROLE.OBSERVADOR,
            SIRHA.ROLE.TECNICO,
            SIRHA.ROLE.UNIDAD,
        ],
    },
    {
        key: SIRHA.ESTADO_RENOVACAO.PENDING_RENOV_LICENSE,
        roles: [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.ADMINISTRATIVO],
        roles_only_read:
            window.SIRHA.getARA() === "ARAS" ? [SIRHA.ROLE.JURIDICO] : undefined,
    },
    {
        key: SIRHA.ESTADO_RENOVACAO.PENDING_REVIEW_DIR,
        roles: [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.DIRECCION],
    },
    {
        key: SIRHA.ESTADO_RENOVACAO.PENDING_REVIEW_DJ,
        roles: [
            SIRHA.ROLE.ADMIN,
            SIRHA.ROLE.OBSERVADOR,
            SIRHA.ROLE.TECNICO,
            SIRHA.ROLE.JURIDICO,
            SIRHA.ROLE.UNIDAD,
        ],
    },
    {
        key: SIRHA.ESTADO_RENOVACAO.PENDING_TECH_DECISION,
        roles: [
            SIRHA.ROLE.ADMIN,
            SIRHA.ROLE.OBSERVADOR,
            SIRHA.ROLE.TECNICO,
            SIRHA.ROLE.UNIDAD,
        ],
    },
    {
        key: SIRHA.ESTADO_RENOVACAO.PENDING_EMIT_LICENSE,
        roles: [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.JURIDICO],
    },
    {
        key: SIRHA.ESTADO_RENOVACAO.PENDING_DIR_SIGN,
        roles: [
            SIRHA.ROLE.ADMIN,
            SIRHA.ROLE.OBSERVADOR,
            SIRHA.ROLE.DIRECCION,
            SIRHA.ROLE.JURIDICO,
        ],
    },
    {
        key: SIRHA.ESTADO_RENOVACAO.DE_FACTO,
        roles: [],
    },
    {
        key: SIRHA.ESTADO_RENOVACAO.PENDING_DADOS_LICENSE,
        roles: [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.JURIDICO],
    },
];

window.SIXHIARA.ESTADOS_FACT = [
    {
        key: window.SIRHA.ESTADO_FACT.NO,
        roles: [],
    },
    {
        key: window.SIRHA.ESTADO_FACT.PAID,
        roles: [],
    },
    {
        key: window.SIRHA.ESTADO_FACT.PENDING_PAY,
        roles: [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.FINANCIERO],
    },
    {
        key: window.SIRHA.ESTADO_FACT.PENDING_INVOICE,
        roles: [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.FINANCIERO],
    },
    {
        key: window.SIRHA.ESTADO_FACT.PENDING_M3,
        roles: [
            SIRHA.ROLE.ADMIN,
            SIRHA.ROLE.OBSERVADOR,
            SIRHA.ROLE.TECNICO,
            SIRHA.ROLE.FINANCIERO,
            SIRHA.ROLE.UNIDAD,
        ],
    },
];

window.SIXHIARA.IVA = 17;

if (window.SIRHA.getARA() === "DPMAIP") {
    Object.assign(SIXHIARA, {
        center: [-15.25, 39.0],
        southWest: [-15.05, 34.89],
        northEast: [-10.47, 40.65],
    });
}

if (window.SIRHA.getARA() === "ARAN") {
    Object.assign(SIXHIARA, {
        center: [-13, 38.505],
        southWest: [-15.05, 34.89],
        northEast: [-10.47, 40.65],
    });
}

if (window.SIRHA.getARA() === "ARAS") {
    Object.assign(SIXHIARA, {
        center: [-22.6, 33.8],
        southWest: [-26.88, 31.3],
        northEast: [-21.0, 35.8],
    });
    window.SIXHIARA.IVA = 12.75;
    window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.JURIDICO] = [
        SIRHA.ROLE.JURIDICO,
        SIRHA.ROLE.DIRECCION,
    ];
}

if (window.SIRHA.getARA() === "ARAZ") {
    Object.assign(SIXHIARA, {
        center: [-16, 34.63],
        southWest: [-18.99, 30.21],
        northEast: [-11.56, 37.2],
    });

    window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.JURIDICO] = [
        SIRHA.ROLE.JURIDICO,
        SIRHA.ROLE.ADMINISTRATIVO,
        SIRHA.ROLE.DIRECCION,
    ];
}

if (window.SIRHA.getARA() === "ARAC") {
    Object.assign(SIXHIARA, {
        center: [-19.78, 34.01],
        southWest: [-22.05, 32.03],
        northEast: [-17.51, 35.91],
    });

    window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.JURIDICO] = [
        SIRHA.ROLE.JURIDICO,
        SIRHA.ROLE.ADMINISTRATIVO,
        SIRHA.ROLE.DIRECCION,
    ];
}

if (window.SIRHA.getARA() === "ARACN") {
    Object.assign(SIXHIARA, {
        center: [-15.34, 38.3],
        southWest: [-17.86, 35.7],
        northEast: [-13.29, 40.84],
    });
    window.SIXHIARA.IVA = 0;
    window.SIXHIARA.GROUPS_TO_ROLES[SIRHA.ROLE.JURIDICO] = [
        SIRHA.ROLE.JURIDICO,
        SIRHA.ROLE.ADMINISTRATIVO,
        SIRHA.ROLE.DIRECCION,
    ];
}

window.SIXHIARA.xlsFieldsToExport = {};
if (window.SIRHA.getARA() === "DPMAIP") {
    window.SIXHIARA.xlsFieldsToExport.exploracaos = [
        {header: "Nome Utente", value: "utente.nome"},
        {header: "Nuit", value: "utente.nuit"},
        {header: "Tipo Utente", value: "utente.uten_tipo"},
        {header: "Número Membros", value: "utente.uten_memb"},
        {header: "Número Mulheres", value: "utente.uten_mulh"},
        {header: "Número Registo Comercial", value: "utente.reg_comerc"},
        {header: "Local do registo", value: "utente.reg_zona"},
        {header: "Provincia", value: "utente.loc_provin"},
        {header: "Distrito", value: "utente.loc_distri"},
        {header: "Posto", value: "utente.loc_posto"},
        {header: "Bairro", value: "utente.loc_nucleo"},
        {header: "Endereço", value: "utente.loc_endere"},
        {header: "Observações", value: "utente.observacio"},
        {header: "Número Exploração", value: "exp_id"},
        {header: "Nome Exploração", value: "exp_name"},
        {header: "Consumo Licença", value: "c_licencia"},
        {header: "Consumo Solicitado", value: "c_soli"},
        {header: "Área Exploração (ha)", value: "actividade.area_pisc"},
        {header: "Ano inicio Actividade", value: "actividade.ano_i_ati"},
        {header: "Número Tanques/Gaiolas", value: "actividade.n_tanques"},
        {
            header: "Volume Tanques/Gaiolas (reservas)",
            value: "actividade.vol_tot_t",
        },
        {header: "Número Alevinos povoados", value: "actividade.n_ale_pov"},
        {header: "Producção Anual (Kg)", value: "actividade.produc_pi"},
        {header: "Processamento Peixe", value: "actividade.tipo_proc"},
        {
            header: "Tratamento Água entra Tanques",
            value: "actividade.trat_t_en",
        },
        {
            header: "Tratamento Água sai Tanques",
            value: "actividade.trat_a_sa",
        },
        {header: "Gaiolas Submersas em", value: "actividade.gaio_subm"},
        {header: "Problemas Exploraçaõ", value: "actividade.problemas"},
        {header: "Principais Problemas", value: "actividade.prob_prin"},
    ];

    window.SIXHIARA.xlsFieldsToExport.tanques = [
        {header: "Nome Utente", value: "utente"},
        {header: "Número Exploração", value: "exp_id"},
        {header: "Id Tanque", value: "tanque_id"},
        {header: "Tipo ", value: "tipo"},
        {header: "Comprimento (m)", value: "cumprimen"},
        {header: "Largura (m)", value: "largura"},
        {header: "Profundidade (m)", value: "profundid"},
        {header: "Área (m2)", value: "area"},
        {header: "Área GPS (m2)", value: "area_gps"},
        {header: "Volume (m3)", value: "volume"},
        {header: "Estado", value: "estado"},
        {header: "Espécie Cultivada", value: "esp_culti"},
        {header: "Espécie Cultivada (outros)", value: "esp_cul_o"},
        {header: "Tipo Alimentação", value: "tipo_alim"},
        {header: "Tipo Alimenção (outros)", value: "tipo_al_o"},
        {header: "Número Alevinos povoados", value: "n_ale_pov"},
        {header: "Proveniência Alevinos", value: "prov_alev"},
        {header: "Proveniência Alevinos (outros)", value: "prov_al_o"},
        {header: "Venda (Kg)", value: "venda"},
        {header: "Consumo", value: "consumo"},
        {header: "Producção Anual (Kg)", value: "pro_anual"},
        {header: "Peso médio Peixes (g)", value: "peso_med"},
        {header: "Fertilização Água", value: "fert_agua"},
    ];

    window.SIXHIARA.shpFieldsToExport = [
        {header: "exp_id", value: "exp_id"},
        {header: "exp_name", value: "exp_name"},
        {header: "loc_provin", value: "loc_provin"},
        {header: "loc_distri", value: "loc_distri"},
        {header: "loc_posto", value: "loc_posto"},
        {header: "loc_nucleo", value: "loc_nucleo"},
        {header: "loc_endere", value: "loc_endere"},
        {header: "loc_bacia", value: "loc_bacia"},
        {header: "loc_subaci", value: "loc_subaci"},
        {header: "loc_rio", value: "loc_rio"},
        {header: "utente", value: "utente.nome"},
        {header: "uten_nuit", value: "utente.nuit"},
        {header: "con_l_to", value: "c_licencia"},
        {
            header: "tipo_subt",
            value: function(exp) {
                var lic = exp.licencias.filter(lic => lic.tipo_agua == "Subterrânea");
                return lic.length > 0;
            },
        },
        {
            header: "con_l_sb",
            value: function(exp) {
                var lic = exp.licencias.filter(lic => lic.tipo_agua == "Subterrânea");
                return (lic[0] && lic[0].c_licencia) || null;
            },
        },
        {
            header: "tipo_supe",
            value: function(exp) {
                var lic = exp.licencias.filter(lic => lic.tipo_agua == "Superficial");
                return lic.length > 0;
            },
        },
        {
            header: "con_l_su",
            value: function(exp) {
                var lic = exp.licencias.filter(lic => lic.tipo_agua == "Superficial");
                return (lic[0] && lic[0].c_licencia) || null;
            },
        },
        {header: "observacio", value: "observacio"},
        {header: "area_pisc", value: "actividade.area_pisc"},
        {header: "ano_i_ati", value: "actividade.ano_i_ati"},
        {header: "n_tanques", value: "actividade.n_tanques"},
        {header: "vol_tot_t", value: "actividade.vol_tot_t"},
        {header: "n_ale_pov", value: "actividade.n_ale_pov"},
        {header: "produc_pi", value: "actividade.produc_pi"},
        {header: "tipo_proc", value: "actividade.tipo_proc"},
        {header: "asis_aber", value: "actividade.asis_aber"},
        {header: "asis_moni", value: "actividade.asis_moni"},
        {header: "trat_t_en", value: "actividade.trat_t_en"},
        {header: "trat_a_sa", value: "actividade.trat_a_sa"},
        {header: "gaio_subm", value: "actividade.gaio_subm"},
        {header: "problemas", value: "actividade.problemas"},
        {header: "prob_prin", value: "actividade.prob_prin"},
    ];
    // Botched job warning: The spaces (blank) in some header fields of this part of the code are use to adjust the width of the columns in xlsx export.
    // The default setting is made in "setColumnsWidthFromHeaderRow" function on ButtonExportXLSView.js
} else {
    window.SIXHIARA.xlsFieldsToExport.exploracaos = [
        {header: "       Nome Utente       ", value: "utente.nome"},
        {header: "   Tipo Utente   ", value: "utente.uten_tipo"},
        {header: "     Email Utente     ", value: "utente.email"},
        {header: "   Telefone Utente   ", value: "utente.telefone"},
        {header: "Número Exploração", value: "exp_id"},
        {header: "       Nome Exploração       ", value: "exp_name"},
        {
            header: "Ano",
            value: function(exp) {
                return SIRHA.Services.IdService.extractYearFromExpId(exp);
            },
        },
        {header: "Província Exploração", value: "loc_provin"},
        {header: "Distrito Exploração", value: "loc_distri"},
        {header: "Posto Exploração", value: "loc_posto"},
        {header: "Bairro Exploração", value: "loc_nucleo"},
        {header: "       Endereço Exploração       ", value: "loc_endere"},
        {header: "Unidade", value: "loc_unidad"},
        {header: "Bacia", value: "loc_bacia"},
        {header: "   Actividade   ", value: "actividade.tipo"},
        {
            header: "   Tipo Água   ",
            value: function(exp) {
                var licSubterranea = exp.licencias.filter(
                    lic => lic.tipo_agua == "Subterrânea"
                ).length;
                var licSuperficial = exp.licencias.filter(
                    lic => lic.tipo_agua == "Superficial"
                ).length;
                if (licSubterranea && licSuperficial) {
                    return "Ambas";
                } else if (licSubterranea) {
                    return "Subterrânea";
                } else if (licSuperficial) {
                    return "Superficial";
                } else {
                    return "";
                }
            },
        },
        {
            header: "Número Licença Sub.",
            value: function(exp) {
                var lic = exp.licencias.filter(lic => lic.tipo_agua == "Subterrânea");
                return (lic[0] && lic[0].lic_nro) || null;
            },
        },
        {
            header: "Estado Licença Sub.",
            value: function(exp) {
                var lic = exp.licencias.filter(lic => lic.tipo_agua == "Subterrânea");
                return (lic[0] && lic[0].estado) || null;
            },
        },
        {
            header: "Tipo Licença Sub.",
            value: function(exp) {
                var lic = exp.licencias.filter(lic => lic.tipo_agua == "Subterrânea");
                return (lic[0] && lic[0].tipo_lic) || null;
            },
        },
        {
            header: "Data Emissão Sub.",
            value: function(exp) {
                var lic = exp.licencias.filter(lic => lic.tipo_agua == "Subterrânea");
                return (lic[0] && formatter().formatDate(lic[0].d_emissao)) || null;
            },
        },
        {
            header: "Data Validade Sub.",
            value: function(exp) {
                var lic = exp.licencias.filter(lic => lic.tipo_agua == "Subterrânea");
                return (lic[0] && formatter().formatDate(lic[0].d_validade)) || null;
            },
        },
        {
            header: "Tipo Consumo Sub.",
            value: function(exp) {
                var lic = exp.licencias.filter(lic => lic.tipo_agua == "Subterrânea");
                return (lic[0] && lic[0].consumo_tipo) || null;
            },
        },
        {
            header: "Número Licença Sup.",
            value: function(exp) {
                var lic = exp.licencias.filter(lic => lic.tipo_agua == "Superficial");
                return (lic[0] && lic[0].lic_nro) || null;
            },
        },
        {
            header: "Estado Licencia Sup.",
            value: function(exp) {
                var lic = exp.licencias.filter(lic => lic.tipo_agua == "Superficial");
                return (lic[0] && lic[0].estado) || null;
            },
        },
        {
            header: "Tipo Licença Sup.",
            value: function(exp) {
                var lic = exp.licencias.filter(lic => lic.tipo_agua == "Superficial");
                return (lic[0] && lic[0].tipo_lic) || null;
            },
        },
        {
            header: "Data Emissão Sup.",
            value: function(exp) {
                var lic = exp.licencias.filter(lic => lic.tipo_agua == "Superficial");
                return (lic[0] && formatter().formatDate(lic[0].d_emissao)) || null;
            },
        },
        {
            header: "Data Validade Sup.",
            value: function(exp) {
                var lic = exp.licencias.filter(lic => lic.tipo_agua == "Superficial");
                return (lic[0] && formatter().formatDate(lic[0].d_validade)) || null;
            },
        },
        {
            header: "Tipo Consumo Sup.",
            value: function(exp) {
                var lic = exp.licencias.filter(lic => lic.tipo_agua == "Superficial");
                return (lic[0] && lic[0].consumo_tipo) || null;
            },
        },
        {header: "Facturação", value: "fact_tipo"},
        {header: "Consumo Real", value: "c_real"},
        {header: "Consumo Licencia", value: "c_licencia"},
        {
            header: "Consumo Factura",
            value: function(exp) {
                return exp.licencias.reduce(
                    (accumulator, lic) => accumulator + lic.consumo_fact,
                    0
                );
            },
        },
        {
            header: "Valor com IVA",
            value: function(exp) {
                return exp.licencias.reduce(
                    (accumulator, lic) => accumulator + lic.pago_iva,
                    0
                );
            },
        },
    ];

    window.SIXHIARA.shpFieldsToExport = [
        {header: "nr_exp", value: "exp_id"},
        {header: "nome_exp", value: "exp_name"},
        {header: "provincia", value: "loc_provin"},
        {header: "distrito", value: "loc_distri"},
        {header: "posto", value: "loc_posto"},
        {header: "bairro", value: "loc_nucleo"},
        {header: "endereco", value: "loc_endere"},
        {header: "unidade", value: "loc_unidad"},
        {header: "bacia", value: "loc_bacia"},
        {header: "actividade", value: "actividade.tipo"},
        {
            header: "tipo_agua",
            value: function(exp) {
                var licSubterranea = exp.licencias.filter(
                    lic => lic.tipo_agua == "Subterrânea"
                ).length;
                var licSuperficial = exp.licencias.filter(
                    lic => lic.tipo_agua == "Superficial"
                ).length;
                if (licSubterranea && licSuperficial) {
                    return "Ambas";
                } else if (licSubterranea) {
                    return "Subterrânea";
                } else if (licSuperficial) {
                    return "Superficial";
                } else {
                    return "";
                }
            },
        },
        {header: "tipo_fact", value: "fact_tipo"},
        {header: "c_real", value: "c_real"},
        {header: "c_licenc", value: "c_licencia"},
        {
            header: "c_factura",
            value: function(exp) {
                return exp.licencias.reduce(
                    (accumulator, lic) => accumulator + lic.consumo_fact,
                    0
                );
            },
        },
        {
            header: "valor_iva",
            value: function(exp) {
                return exp.licencias.reduce(
                    (accumulator, lic) => accumulator + lic.pago_iva,
                    0
                );
            },
        },
    ];
}
