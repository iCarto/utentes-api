Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.EstadoRenovacaoCollection = Backbone.UILib.DomainCollection.extend({

    url: '/api/domains/licencia_estado_renovacao',
    model: Backbone.SIXHIARA.EstadoRenovacao,

    forRenovacoesFilterView: function() {
        if (this.filter((d) => d.get('text') === null).length > 0) {
            return this;
        } else {
            var collection = new Backbone.SIXHIARA.EstadoRenovacaoCollection(this.models);
            collection.unshift(new  Backbone.SIXHIARA.EstadoRenovacao());
            return collection;
        }
    },

    forRenovacoesView: function() {
        if (! window.SIRHA.is_single_user_mode()) {
            var states = this.availableRenovacaoStates();
            var foo = this.filter(function(e){
                return states.indexOf(e.get('text')) !== -1
            })
            return new Backbone.SIXHIARA.EstadoRenovacaoCollection(foo);
        } else {
            return new Backbone.SIXHIARA.EstadoRenovacaoCollection(this.models);
        }
    },

    availableRenovacaoStates: function() {
        var role = iAuth.getMainRole();
        var states = window.SIXHIARA.ESTADOS_RENOVACAO.filter(function(s) {
            return s.roles.indexOf(role) !== -1;
        });
        states = states.map(function(s) {
            return s.key;
        })
        return states;
    },

    available: function(data) {
        var state = model.get('estado_lic');
        return this.where({'text': state}).length > 0;
    }

});
