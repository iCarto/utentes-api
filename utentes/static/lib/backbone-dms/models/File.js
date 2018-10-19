Backbone.DMS = Backbone.DMS || {};

Backbone.DMS.File = Backbone.Model.extend({

    defaults: {
        'name': '',
        'type': '',
        'size': '',
        'url': '',
        'permissions': null
    },

    navigateTrigger: function() {
        this.trigger('navigate', this)
    }

});
