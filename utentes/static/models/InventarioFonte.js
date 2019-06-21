Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Utente = Backbone.GeoJson.Feature.extend({
    urlRoot: Backbone.SIXHIARA.Config.apiImport,

    validate: function(attrs, options) {
        var messages = [];
        validator(UTENTE_SCHEMA)
            .validate(this.attributes)
            .forEach(function(msg) {
                messages.push(msg);
            });
        if (messages.length > 0) return messages;
    },
});
