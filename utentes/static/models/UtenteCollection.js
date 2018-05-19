Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.UtenteCollection = Backbone.Collection.extend({

    model: Backbone.SIXHIARA.Utente,

    url: Backbone.SIXHIARA.Config.apiUtentes

});
