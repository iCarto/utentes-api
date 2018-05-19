window.nodeRequire = window.require ;
delete window.require;
delete window.exports;
delete window.module;

SIXHIARA = window.SIXHIARA || {
    center:[-13, 38.5050],
    southWest:[-23, 31],
    northEast:[-9, 43],
    search: {
      zoom: 8,
    },
};

window.SIXHIARA.xlsFieldsToExport = [
    {'header': 'Nome', 'value': 'utente.nome'},
    {'header': 'Nuit', 'value': 'utente.nuit'},
    {'header': 'Tipo de utente', 'value': 'utente.uten_tipo'},
    {'header': 'Nro registro comercial', 'value': 'utente.reg_comerc'},
    {'header': 'Registrado em', 'value': 'utente.reg_zona'},
    {'header': 'Provincia', 'value': 'utente.loc_provin'},
    {'header': 'Distrito', 'value': 'utente.loc_distri'},
    {'header': 'Posto', 'value': 'utente.loc_posto'},
    {'header': 'Bairro', 'value': 'utente.loc_nucleo'},
    {'header': 'Observações', 'value': 'utente.observacio'},
    {'header': 'Id Exp', 'value': 'exp_id'},
    {'header': 'Nome exploraçõe', 'value': 'exp_name'},
    {'header': 'Actividade', 'value': 'actividade.tipo'},
    {'header': 'Consumo licenciado', 'value': 'c_licencia'},
    {'header': 'Consumo solicitado', 'value': 'c_soli'},
    {'header': 'Consumo real', 'value': 'c_real'},
    {'header': 'Consumo estimado', 'value': 'c_estimado'},
    {'header': 'Valor com IVA (MZN/mês)',
     'value': function(exp) {
         return exp.licencias.reduce(
             (accumulator, lic) => accumulator + lic.pago_iva,
         0);
     }},
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
    'value': function (exp) { return exp.actividade.tipo === 'Abastecimento'; }
    },
    { 'header': 'saneament',
    'value': function (exp) { return exp.actividade.tipo === 'Saneamento'; }
    },
    { 'header': 'agricultu',
    'value': function (exp) { return exp.actividade.tipo === 'Agricultura de Regadio'; }
    },
    { 'header': 'pecuaria',
    'value': function (exp) { return exp.actividade.tipo === 'Pecuária'; }
    },
    { 'header': 'piscicult',
    'value': function (exp) { return exp.actividade.tipo === 'Piscicultura'; }
    },
    { 'header': 'industria',
    'value': function (exp) { return exp.actividade.tipo === 'Indústria'; }
    },
    { 'header': 'pro_energ',
    'value': function (exp) { return exp.actividade.tipo === 'Producção de energia'; }
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
