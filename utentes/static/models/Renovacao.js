Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Renovacao = Backbone.Model.extend({
    dateFields: [
        "d_soli",
        "d_ultima_entrega_doc",
        "d_emissao_sub_old",
        "d_emissao_sub",
        "d_emissao_sup_old",
        "d_emissao_sup",
        "d_validade_sub_old",
        "d_validade_sub",
        "d_validade_sup_old",
        "d_validade_sup",
    ],

    urlRoot: Backbone.SIXHIARA.Config.apiRenovacoes,

    defaults: {
        id: null,

        exp_id: null,

        d_soli: null,
        d_ultima_entrega_doc: null,

        estado: SIRHA.ESTADO_RENOVACAO.NOT_EXISTS,

        carta_ren: false,
        carta_ren_v: false,

        ident_pro: false,
        ident_pro_v: false,

        certi_reg: false,
        certi_reg_v: false,

        duat: false,
        duat_v: false,

        anali_doc: false,
        soli_visit: false,
        p_unid: false,
        p_tec: false,
        doc_legal: false,
        p_juri: false,
        p_rel: false,
        lic_imp: false,

        tipo_lic_sup_old: null,
        d_emissao_sup_old: null,
        d_validade_sup_old: null,
        c_licencia_sup_old: null,
        consumo_fact_sup_old: null,

        tipo_lic_sup: null,
        d_emissao_sup: null,
        d_validade_sup: null,
        c_licencia_sup: null,

        tipo_lic_sub_old: null,
        d_emissao_sub_old: null,
        d_validade_sub_old: null,
        c_licencia_sub_old: null,
        consumo_fact_sub_old: null,

        tipo_lic_sub: null,
        d_emissao_sub: null,
        d_validade_sub: null,
        c_licencia_sub: null,

        exploracao: null,
        obser: false,

        lic_time_info: null,
        lic_time_enough: false,
        lic_time_warning: false,
        lic_time_over: false,
    },

    setLicState: function(state) {
        this.set("estado", state);
    },
});
