Backbone.DMS = Backbone.DMS || {};

Backbone.DMS.FilePending = Backbone.Model.extend({
    defaults: {
        id: null,
        filename: null,
        data: null,
    },

    idAttribute: "filename",

    initialize: function() {
        this.set("id", this.id);
    },
});
