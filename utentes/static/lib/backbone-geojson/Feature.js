Backbone.GeoJson = Backbone.GeoJson || {};
Backbone.GeoJson.Feature = Backbone.Model.extend({

    parse: function(response){
        var newResponse = {};
        newResponse.geometry = new Backbone.Model(response.geometry);
        _.keys(response.properties).forEach(function(key){
            newResponse[key] = response.properties[key];
        });
        return newResponse;
    },

    toGeoJSON: function(){
        return {
            "type": "Feature",
            "geometry": this.get('geometry').toJSON(),
            "properties": _.omit(this.toJSON(), 'geometry'),
        };
    },

});
