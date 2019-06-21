Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.EstadoRenovacao = Backbone.UILib.Domain.extend({
    urlRoot: "/api/domains/licencia_estado_renovacao",

    defaults: {
        category: "licencia_estado_renovacao",
        alias: "",
        text: "",
        order: 0,
        parent: null,
    },
});
