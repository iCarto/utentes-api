Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadeRegadia = Backbone.SIXHIARA.ActividadeNull.extend({

    defaults: {
        'id':         null,
        'tipo':       'Agricultura de Regadio',
        'c_estimado': null,
        'n_cul_tot': null,
        'area_pot': null,
        'area_irri': null,
        'area_medi': null,
        'cultivos':   new Backbone.SIXHIARA.CultivoCollection(),
    },

    initialize: function () {
        this.get('cultivos').on('all', this.updateChildBasedComputations, this);
    },

    parse: function(response) {
        response.cultivos = new Backbone.SIXHIARA.CultivoCollection(response.cultivos, {parse: true});
        return response;
    },

    updateChildBasedComputations: function () {
       var c_estimado = this.get('cultivos').reduce(function(sum, cultivo){
            return sum + cultivo.get('c_estimado');
        }, 0);
        this.set('c_estimado', c_estimado);

        this.set('n_cul_tot', this.get('cultivos').length);

        var area_medi = this.get('cultivos').reduce(function(sum, cultivo){
            return sum + cultivo.get('area');
        }, 0);
        this.set('area_medi', area_medi);

        this.trigger('change', this.model);
    },

    toJSON: function () {
        var json      =  _.clone(this.attributes);
        json.cultivos = this.get('cultivos').toJSON();
        return json;
    },

    validateSubActivity: function() {
        var messages = [];
        this.get('cultivos').forEach(function(cultivo){
            var msgs = cultivo.validate();
            if (msgs) {
                messages = messages.concat(msgs);
            }
        });
        return messages;
    },

    getActividadeLayer: function(map) {
        var cultivos = this.get('cultivos');
        if (! cultivos) return null;
        var geojson = cultivos.toGeoJSON();
        if (geojson.features.length == 0) return null;
        return L.geoJson(geojson, {
            onEachFeature: function(feature, layer) {
                var label = L.marker(layer.getBounds().getCenter(), {
                    icon: L.divIcon({
                        className: 'label',
                        html: feature.properties.cult_id.slice(-3),
                        iconSize: [100, 40]
                    })
                }).addTo(map);
            },
            style: {
                stroke: true,
                color: '#aa6e00',
                weight: 1,
                opacity: 1,
                fillColor: '#aa6e00',
                fillOpacity: 0.5,
            }
        });
    },

});

// declare activity for dinamic discovery
Backbone.SIXHIARA.ActividadesFactory = Backbone.SIXHIARA.ActividadesFactory || {};
Backbone.SIXHIARA.ActividadesFactory['Agricultura de Regadio'] = Backbone.SIXHIARA.ActividadeRegadia;
