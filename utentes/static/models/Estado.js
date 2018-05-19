Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.Estado = Backbone.UILib.Domain.extend({

    urlRoot: '/api/domains/licencia_estado',

    defaults: {
        'category': 'licencia_estado',
        'alias':    '',
        'text':     '',
        'order':    0,
        'parent':   'precampo',
    }
});
