Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.EstadoRenovacaoCollection = Backbone.UILib.DomainCollection.extend({

    url: '/api/domains/licencia_estado_renovacao',
    model: Backbone.SIXHIARA.EstadoRenovacao,

    initialize: function(options) {
        this.options = options || {};

        this.ESTADOS_RENOVACAO = [
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.NOT_APPROVED,
                'roles': [],
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.IRREGULAR,
                'roles': []
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.INCOMPLETE_DA,
                'roles': [ROL_ADMIN, ROL_OBSERVADOR, ROL_ADMINISTRATIVO]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.INCOMPLETE_DIR,
                'roles': [ROL_ADMIN, ROL_OBSERVADOR, ROL_DIRECCION, ROL_JURIDICO]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.INCOMPLETE_DJ,
                'roles': [ROL_ADMIN, ROL_OBSERVADOR, ROL_JURIDICO, ROL_TECNICO]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.INCOMPLETE_DT,
                'roles': [ROL_ADMIN, ROL_OBSERVADOR, ROL_TECNICO]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.PENDING_RENOV_LICENSE,
                'roles': [ROL_ADMIN, ROL_OBSERVADOR, ROL_ADMINISTRATIVO]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.PENDING_REVIEW_DIR,
                'roles': [ROL_ADMIN, ROL_OBSERVADOR, ROL_DIRECCION, ROL_JURIDICO]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.PENDING_REVIEW_DJ,
                'roles': [ROL_ADMIN, ROL_OBSERVADOR, ROL_TECNICO, ROL_JURIDICO]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.PENDING_TECH_DECISION,
                'roles': [ROL_ADMIN, ROL_OBSERVADOR, ROL_TECNICO]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.PENDING_EMIT_LICENSE,
                'roles': [ROL_ADMIN, ROL_OBSERVADOR, ROL_JURIDICO]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.PENDING_DIR_SIGN,
                'roles': [ROL_ADMIN, ROL_OBSERVADOR, ROL_DIRECCION, ROL_JURIDICO]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.DE_FACTO,
                'roles': []
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.PENDING_DADOS_LICENSE,
                'roles': [ROL_ADMIN, ROL_OBSERVADOR, ROL_JURIDICO]
            },
        ];
    },

    forRenovacoesFilterView: function() {
        if (this.filter((d) => d.get('text') === null).length > 0) {
            return this;
        } else {
            var collection = new Backbone.SIXHIARA.EstadoRenovacaoCollection(this.models);
            collection.unshift(new  Backbone.SIXHIARA.EstadoRenovacao());
            return collection;
        }
    },

    forRenovacoesView: function() {

        if (! window.SIRHA.is_single_user_mode()) {
            var states = this.availableRenovacaoStates();
            var foo = this.filter(function(e){
                return states.indexOf(e.get('text')) !== -1
            })
            return new Backbone.SIXHIARA.EstadoRenovacaoCollection(foo);
        } else {
            return new Backbone.SIXHIARA.EstadoRenovacaoCollection(this.models);
        }
    },

    availableRenovacaoStates: function() {
        var role = wfr.getRole();
        var states = this.ESTADOS_RENOVACAO.filter(function(s) {
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
    }

});
