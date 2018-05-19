Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.CultivoCollection = Backbone.GeoJson.FeatureCollection.extend({

    model: Backbone.SIXHIARA.ActividadeCultivo,
    url: Backbone.SIXHIARA.Config.apiCultivos,
});
