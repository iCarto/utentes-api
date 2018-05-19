Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.UserCollection = Backbone.Collection.extend({

    url: '/api/users',
    model: Backbone.SIXHIARA.User,

    initialize: function(options) {
        this.options = options || {};
    },
});
