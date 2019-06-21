Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Expediente = Backbone.Model.extend({
    urlRoot: "/api/expedientes",

    defaults: {
        exp_id: "",
        exp_name: "",
    },
});
