Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.NewFactura = Backbone.Model.extend({
    urlRoot: "/api/facturacao/",

    url: function() {
        return this.urlRoot + this.get("id") + "/emitir_factura";
    },
});
