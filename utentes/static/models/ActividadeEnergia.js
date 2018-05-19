Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadeEnergia = Backbone.SIXHIARA.ActividadeNull.extend({

    defaults: {
        'id':           null,
        'tipo':         'Producção de energia',
        'c_estimado':   null,
        'energia_tipo': null,
        'alt_agua':     null,
        'potencia':     null,
        'equipo':       null,
        'eval_impac':   null
    },

});

// declare activity for dinamic discovery
Backbone.SIXHIARA.ActividadesFactory = Backbone.SIXHIARA.ActividadesFactory || {};
Backbone.SIXHIARA.ActividadesFactory['Producção de energia'] = Backbone.SIXHIARA.ActividadeEnergia;
