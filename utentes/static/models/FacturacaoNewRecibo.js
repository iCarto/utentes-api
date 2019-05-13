Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.NewRecibo = Backbone.Model.extend({

    urlRoot: '/api/facturacao/',

    url: function(){
        return this.urlRoot + this.get("id") + '/emitir_recibo';
    }

});
