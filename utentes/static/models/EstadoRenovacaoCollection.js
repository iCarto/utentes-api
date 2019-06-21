Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.EstadoRenovacaoCollection = Backbone.UILib.DomainCollection.extend({
    url: "/api/domains/licencia_estado_renovacao",
    model: Backbone.SIXHIARA.EstadoRenovacao,

    forRenovacoesView: function() {
        var states = this.availableRenovacaoStates();
        var foo = this.filter(function(e) {
            return states.indexOf(e.get("text")) !== -1;
        });
        return new Backbone.SIXHIARA.EstadoRenovacaoCollection(foo);
    },

    availableRenovacaoStates: function() {
        var states = window.SIXHIARA.ESTADOS_RENOVACAO.filter(function(s) {
            return iAuth.user_roles_in(s.roles, "not-safe");
        });
        states = states.map(function(s) {
            return s.key;
        });
        return states;
    },
});
