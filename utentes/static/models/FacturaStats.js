Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.FacturaStats = Backbone.Model.extend({
    idAttribute: "gid",

    defaults: {
        gid: null,
        exp_id: null,
        utente_id: null,
        utente: null,
        numero_facturas_esperadas: null,
        consumo_facturas_esperadas: null,
        importe_facturas_esperadas: null,
        numero_facturas_emitidas: null,
        consumo_facturas_emitidas: null,
        importe_facturas_emitidas: null,
        numero_facturas_cobradas: null,
        consumo_facturas_cobradas: null,
        importe_facturas_cobradas: null,
    },
});
