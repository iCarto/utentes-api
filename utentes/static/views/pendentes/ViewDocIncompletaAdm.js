Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewDocIncompletaAdm = Backbone.SIXHIARA.ViewSecretaria1.extend({
    init: function() {
        Backbone.SIXHIARA.ViewSecretaria1.prototype.init.call(this);
        document
            .querySelectorAll('table input[type="checkbox"]')
            .forEach(function(input) {
                input.disabled = false;
            });
        return this;
    },
});
