Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.FacturacaoFactEstadoCollection = Backbone.UILib.DomainCollection.extend(
    {
        url: "/api/domains/facturacao_fact_estado",
        model: Backbone.SIXHIARA.FacturacaoFactEstado,

        forFacturacaoView: function() {
            var states = this.availableFacturacaoStates();
            var foo = this.filter(function(e) {
                return states.indexOf(e.get("text")) !== -1;
            });
            return new Backbone.SIXHIARA.FacturacaoFactEstadoCollection(foo);
        },

        availableFacturacaoStates: function() {
            var states = window.SIXHIARA.ESTADOS_FACT.filter(function(s) {
                return iAuth.user_roles_in(s.roles, "not-safe");
            });
            states = states.map(function(s) {
                return s.key;
            });
            return states;
        },
    }
);
