Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.User = Backbone.Model.extend({

    urlRoot: '/api/users',

    defaults: {
        'id': null,
        'username': null,
        'usergroup': null,
        'password': null,
    }
});
