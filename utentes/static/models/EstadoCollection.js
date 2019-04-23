Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.EstadoCollection = Backbone.UILib.DomainCollection.extend({

    url: '/api/domains/licencia_estado',
    model: Backbone.SIXHIARA.Estado,

    forSearchView: function() {
        if (! window.SIRHA.is_single_user_mode()) {
            return new Backbone.SIXHIARA.EstadoCollection(this.where({'parent': 'post-licenciada'}));
        } else {
            return new Backbone.SIXHIARA.EstadoCollection(this.models);
        }
    },

    forPendentesView: function() {
        if (! window.SIRHA.is_single_user_mode()) {
            var states = this.availablePendentesStates();
            var foo = this.filter(function(e){
                return states.indexOf(e.get('text')) !== -1
            })
            return new Backbone.SIXHIARA.EstadoCollection(foo);
        } else {
            return new Backbone.SIXHIARA.EstadoCollection(this.models);
        }
    },

    availablePendentesStates: function() {
        var role = iAuth.getMainRole();
        var states = SIXHIARA.ESTADOS_PENDENTES.filter(function(s) {
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
    },
});
