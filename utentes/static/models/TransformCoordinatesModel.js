Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TransformCoordinatesModel = Backbone.Model.extend({
    url: Backbone.SIXHIARA.Config.api_transform_coordinates,

    defaults: {
        org_srs: null,
        dest_srs: null,
        org_x: null,
        org_y: null,
        dest_x: null,
        dest_y: null,
    }
});
