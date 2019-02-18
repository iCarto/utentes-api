Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Renovacao = Backbone.SIXHIARA.Exploracao.extend({

    urlRoot: Backbone.SIXHIARA.Config.apiRenovacoes,

    defaults: {
        id:                  null,

        exp_id:              null,

        d_soli:              null,
        d_ultima_entrega_doc:null,

        estado:              Backbone.SIXHIARA.EstadoRenovacao.NOT_EXISTS,

        carta_ren:           false,
        carta_ren_v:         false,

        ident_pro:           false,
        ident_pro_v:         false,

        certi_reg:           false,
        certi_reg_v:         false,

        duat:                false,
        duat_v:              false,

        anali_doc:           false,
        soli_visit:          false,
        p_unid:              false,
        p_tec:               false,
        doc_legal:           false,
        p_juri:              false,
        p_rel:               false,
        lic_imp:             false,

        tipo_lic_sup_old:    null,
        d_emissao_sup_old:   null,
        d_validade_sup_old:  null,
        c_licencia_sup_old:  null,
        consumo_fact_sup_old:null,

        tipo_lic_sup:        null,
        d_emissao_sup:       null,
        d_validade_sup:      null,
        c_licencia_sup:      null,

        tipo_lic_sub_old:    null,
        d_emissao_sub_old:   null,
        d_validade_sub_old:  null,
        c_licencia_sub_old:  null,
        consumo_fact_sub_old:null,

        tipo_lic_sub:        null,
        d_emissao_sub:       null,
        d_validade_sub:      null,
        c_licencia_sub:      null,

        exploracao:          null,
        obser:               false,

        'lic_time_info':     null,
        'lic_time_enough':   false,
        'lic_time_warning':  false,
        'lic_time_over':     false
    },

    initialize: function(){},

    toJSON: function(){
        return _.clone(this.attributes);
    },

    parse: function(response){
        response = Backbone.GeoJson.Feature.prototype.parse.apply(this, arguments);
        this.parseDate(response, 'd_soli');
        this.parseDate(response, 'd_ultima_entrega_doc');
        this.parseDate(response, 'd_emissao_sub_old');
        this.parseDate(response, 'd_emissao_sub');
        this.parseDate(response, 'd_emissao_sup_old');
        this.parseDate(response, 'd_emissao_sup');
        return response;
    },

    parseDate: function(response, field) {
        if (response[field]) {
            var sTokens = response[field].split('-');
            response[field] = new Date(sTokens[0], sTokens[1] - 1, sTokens[2], 1, 1, 1);
        }
    },

    setLicState: function(state) {
        this.set('estado', state);
    },
});
