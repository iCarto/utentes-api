Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ExploracaoCollection = Backbone.GeoJson.FeatureCollection.extend({

    model: Backbone.SIXHIARA.Exploracao,
    url: Backbone.SIXHIARA.Config.apiExploracaos,
    comparator: 'exp_id',

    filterBy: function(where){
        a = this.filter(function(element) {
            return element.contains(where);
        });
        return new Backbone.SIXHIARA.ExploracaoCollection(a);
    },

    downloadSHP: function() {
        var options = {
            folder: 'exploracoes',
            types: {
                polygon: 'exploracoes',
            }
        }
        var features = this.toSHP();
        shpwrite.download(features, options);
    },

    toSHP: function() {
        var features = [];
        this.models.forEach(function(model){
            var feature = model.toSHP();
            if (! _.isEmpty(feature.geometry)) {
                features.push(feature);
            }
        });
        return {
            'type': 'FeatureCollection',
            'features': features
        };
    },

    withFicha: function() {
        var a = this.filter(function(exp) {
            var expTest = exp.cloneExploracao();
            expTest.setLicState(Backbone.SIXHIARA.Estado.PENDING_FIELD_VISIT);
            return expTest.isValid();
        });
        return new Backbone.SIXHIARA.ExploracaoCollection(a);
    },

});
