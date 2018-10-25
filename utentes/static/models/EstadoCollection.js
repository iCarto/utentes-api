Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.EstadoCollection = Backbone.UILib.DomainCollection.extend({

    url: '/api/domains/licencia_estado',
    model: Backbone.SIXHIARA.Estado,

    initialize: function(options) {
        this.options = options || {};
    },

    forSearchView: function() {

        if (window.SIRHA.is_single_user_mode()) {
            return new Backbone.SIXHIARA.EstadoCollection(this.where({'parent': 'post-licenciada'}));
        } else {
            return new Backbone.SIXHIARA.EstadoCollection(this.models);
        }
    },

    forSearchFilterView: function() {
        if (!this.length) {
            return new Backbone.SIXHIARA.EstadoCollection();
        }
        if (this.filter((d) => d.get('text') === null).length > 0) {
            return this;
        } else {
            var collection = new Backbone.SIXHIARA.EstadoCollection(this.models);
            collection.unshift(new Backbone.SIXHIARA.Estado());
            return collection;
        }
    },

    forPendentesFilterView: function() {
        if (this.filter((d) => d.get('text') === null).length > 0) {
            return this;
        } else {
            var collection = new Backbone.SIXHIARA.EstadoCollection(this.models);
            collection.unshift(new  Backbone.SIXHIARA.Estado());
            return collection;
        }
    },

    forPendentesView: function() {

        if (! window.SIRHA.is_single_user_mode()) {
            var states = this.availablePendentesStates();
            var foo = this.filter(function(e){
                return states.indexOf(e.get('text')) !== -1
            })
            return new Backbone.SIXHIARA.EstadoCollection(foo);
        } else {
            return new Backbone.SIXHIARA.EstadoCollection(this.models);
        }
    },

    availablePendentesStates: function() {
        var role = wf.getRole();
        var states = ESTADOS_PENDENTES.filter(function(s) {
            return s.roles.indexOf(role) !== -1;
        });
        states = states.map(function(s) {
            return s.key;
        })
        return states;
    },

    available: function(data) {
        var state = model.get('estado_lic');
        return this.where({'text': state}).length > 0;
    },
});

var ESTADOS_PENDENTES = [
    {
        'key': Backbone.SIXHIARA.Estado.NOT_EXISTS,
        'roles': [],
    },
    {
        'key': Backbone.SIXHIARA.Estado.NOT_APPROVED,
        'roles': [],
    },
    {
        'key': Backbone.SIXHIARA.Estado.IRREGULAR,
        'roles': []
    },
    {
        'key': Backbone.SIXHIARA.Estado.LICENSED,
        'roles': []
    },
    {
        'key': Backbone.SIXHIARA.Estado.UNKNOWN,
        'roles': []
    },
    {
        'key': Backbone.SIXHIARA.Estado.INCOMPLETE_DA,
        'roles': [ROL_ADMIN, ROL_ADMINISTRATIVO]
    },
    {
        'key': Backbone.SIXHIARA.Estado.INCOMPLETE_DIR,
        'roles': [ROL_ADMIN, ROL_DIRECCION, ROL_JURIDICO]
    },
    {
        'key': Backbone.SIXHIARA.Estado.INCOMPLETE_DJ,
        'roles': [ROL_ADMIN, ROL_JURIDICO, ROL_TECNICO]
    },
    {
        'key': Backbone.SIXHIARA.Estado.INCOMPLETE_DT,
        'roles': [ROL_ADMIN, ROL_TECNICO]
    },
    {
        'key': Backbone.SIXHIARA.Estado.INCOMPLETE_DF,
        'roles': [ROL_ADMIN, ROL_FINANCIERO]
    },
    {
        'key': Backbone.SIXHIARA.Estado.PENDING_REVIEW_DIR,
        'roles': [ROL_ADMIN, ROL_DIRECCION, ROL_JURIDICO]
    },
    {
        'key': Backbone.SIXHIARA.Estado.PENDING_REVIEW_DJ,
        'roles': [ROL_ADMIN, ROL_TECNICO, ROL_JURIDICO]
    },
    {
        'key': Backbone.SIXHIARA.Estado.PENDING_FIELD_VISIT,
        'roles': [ROL_ADMIN, ROL_TECNICO]
    },
    {
        'key': Backbone.SIXHIARA.Estado.PENDING_TECH_DECISION,
        'roles': [ROL_ADMIN, ROL_TECNICO]
    },
    {
        'key': Backbone.SIXHIARA.Estado.PENDING_EMIT_LICENSE,
        'roles': [ROL_ADMIN, ROL_JURIDICO]
    },
    {
        'key': Backbone.SIXHIARA.Estado.PENDING_DIR_SIGN,
        'roles': [ROL_ADMIN, ROL_DIRECCION, ROL_JURIDICO]
    },
    {
        'key': Backbone.SIXHIARA.Estado.DE_FACTO,
        'roles': []
    },
];
