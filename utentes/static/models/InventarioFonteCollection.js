Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.InventarioFonteCollection = Backbone.GeoJson.FeatureCollection.extend(
    {
        model: Backbone.SIXHIARA.InventarioFonte,

        url: Backbone.SIXHIARA.Config.apiImport,
    }
);
