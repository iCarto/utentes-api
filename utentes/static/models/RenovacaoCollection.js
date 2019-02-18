Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.RenovacaoCollection = Backbone.GeoJson.FeatureCollection.extend({

    url: Backbone.SIXHIARA.Config.apiRenovacoes,
    model: Backbone.SIXHIARA.ExpConRenovacao,
    comparator: 'exp_id',

    filterBy: function(where){
        a = this.filter(function(element) {
            return element.contains(where);
        });
        return new Backbone.SIXHIARA.RenovacaoCollection(a);
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
            // expTest.setLicState(Backbone.SIXHIARA.Estado.PENDING_FIELD_VISIT);
            return expTest.isValid();
        });
        return new Backbone.SIXHIARA.RenovacaoCollection(a);
    },

});
