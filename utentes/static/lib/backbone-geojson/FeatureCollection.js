Backbone.GeoJson = Backbone.GeoJson || {};
Backbone.GeoJson.FeatureCollection = Backbone.Collection.extend({

    model: Backbone.GeoJson.Feature,

    parse: function(response){
        return response.features;
    },

    toGeoJSON: function(){
        var features = [];
        this.models.forEach(function(model){
            var feature = model.toGeoJSON();
            if (! _.isEmpty(feature.geometry)) {
                features.push(feature);
            }
        });
        return {
            'type': 'FeatureCollection',
            'features': features
        };
    },

});
