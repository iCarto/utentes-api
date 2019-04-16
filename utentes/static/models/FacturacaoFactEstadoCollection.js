Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.FacturacaoFactEstadoCollection = Backbone.UILib.DomainCollection.extend({

    url: '/api/domains/facturacao_fact_estado',
    model: Backbone.SIXHIARA.FacturacaoFactEstado,

    initialize: function(options) {
        this.options = options || {};
    },

    forSearchFilterView: function() {
        var s = [{
            'category': 'licencia_estado',
            'text': null,
            'order': 0,
        },{
            'category': 'licencia_estado',
            'text': SIRHA.ESTADO.LICENSED,
            'order': 2,
        },{
            'category': 'licencia_estado',
            'text': SIRHA.ESTADO.DE_FACTO,
            'order': 3,
        }];
        return new Backbone.UILib.DomainCollection(s);
    },

    forFacturacaoFilterView: function() {
        if (this.filter((d) => d.get('text') === null).length > 0) {
            return this;
        } else {
            var collection = new Backbone.SIXHIARA.FacturacaoFactEstadoCollection(this.models);
            collection.unshift(new  Backbone.SIXHIARA.FacturacaoFactEstado());
            return collection;
        }
    },

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
        // workaround. con los cambios de concatenar el javascript esto se estaba ejeuctando
        // antes de document.ready
        var myworkflow = window['wf']  || Object.create(MyWorkflow);
        var role = myworkflow.getMainRole();
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
