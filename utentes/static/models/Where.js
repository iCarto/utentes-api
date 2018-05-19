Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Where = Backbone.Model.extend({

    defaults: {
        'loc_provin': null,
        'loc_distri': null,
        'loc_posto':  null,
        'utente':     null,
        'tipo_agua':   null,
        'estado':     null,
        'pagos':      null,
        'actividade': null,
        'mapBounds': null,
    },

    initialize: function() {
        var changes = 'change:loc_provin change:loc_distri change:loc_posto change:utente change:tipo_agua change:estado change:actividade';
        this.on(changes, function(e){
            this.set('mapBounds', null, {silent:true});
        });
    },

    values: function(){
        // only return those pairs that are not void
        return _.omit(this.toJSON(), function(value, key, object){
            return (_.isEmpty(value));
        });
    },

});
