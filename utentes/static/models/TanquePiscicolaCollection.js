Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TanquePiscicolaCollection = Backbone.GeoJson.FeatureCollection.extend(
    {
        model: Backbone.SIXHIARA.TanquePiscicola,
        url: Backbone.SIXHIARA.Config.apiTanquesPiscicolas,
    }
);
