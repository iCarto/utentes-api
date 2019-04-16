Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.EstadoCollection = Backbone.UILib.DomainCollection.extend({

    url: '/api/domains/licencia_estado',
    model: Backbone.SIXHIARA.Estado,

    initialize: function(options) {
        this.options = options || {};
    },

    forSearchView: function() {

        if (! window.SIRHA.is_single_user_mode()) {
            return new Backbone.SIXHIARA.EstadoCollection(this.where({'parent': 'post-licenciada'}));
        } else {
            return new Backbone.SIXHIARA.EstadoCollection(this.models);
        }
    },

    forSearchFilterView: function() {
        if (!this.length) {
            return new Backbone.SIXHIARA.EstadoCollection();
        }
        if (this.filter((d) => d.get('text') === null).length > 0) {
            return this;
        } else {
            var collection = new Backbone.SIXHIARA.EstadoCollection(this.models);
            collection.unshift(new Backbone.SIXHIARA.Estado());
            return collection;
        }
    },

    forPendentesFilterView: function() {
        if (this.filter((d) => d.get('text') === null).length > 0) {
            return this;
        } else {
            var collection = new Backbone.SIXHIARA.EstadoCollection(this.models);
            collection.unshift(new  Backbone.SIXHIARA.Estado());
            return collection;
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
        var role = wf.getMainRole();
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
