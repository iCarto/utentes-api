Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.FacturacaoFactEstadoCollection = Backbone.UILib.DomainCollection.extend({

    url: '/api/domains/facturacao_fact_estado',
    model: Backbone.SIXHIARA.FacturacaoFactEstado,

    forFacturacaoView: function() {
        if (! window.SIRHA.is_single_user_mode()) {
            var states = this.availableFacturacaoStates();
            var foo = this.filter(function(e){
                return states.indexOf(e.get('text')) !== -1
            })
            return new Backbone.SIXHIARA.FacturacaoFactEstadoCollection(foo);
        } else {
            return new Backbone.SIXHIARA.FacturacaoFactEstadoCollection(this.models);
        }
    },

    availableFacturacaoStates: function() {
        var role = iAuth.getMainRole();
        var states = window.SIXHIARA.ESTADOS_FACT.filter(function(s) {
            return s.roles.indexOf(role) !== -1;
        });
        states = states.map(function(s) {
            return s.key;
        })
        return states;
    },

    available: function(data) {
        var state = data.get('fact_estado');
        return this.where({'text': state}).length > 0;
    },
});
