Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Setting = Backbone.Model.extend({
    urlRoot: "/api/settings",

    parse: function(response) {
        response.id = "docPath"; //FIXME
        return response;
    },
});
