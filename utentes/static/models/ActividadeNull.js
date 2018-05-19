Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadeNull = Backbone.Model.extend({

    defaults: {
        'id': null,
        'tipo': 'Actividade non declarada',
    },

    getActividadeLayer: function(map) {
        // nothing to do here
    },

    validateSubActivity: function() {
        // nothing to do here
    },

});

// declare activity for dinamic discovery
Backbone.SIXHIARA.ActividadesFactory = Backbone.SIXHIARA.ActividadesFactory || {};
Backbone.SIXHIARA.ActividadesFactory['Actividade non declarada'] = Backbone.SIXHIARA.ActividadeNull;
