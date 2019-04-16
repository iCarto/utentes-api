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
                'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.ADMINISTRATIVO]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.INCOMPLETE_DIR,
                'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.DIRECCION, SIRHA.ROLE.JURIDICO]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.INCOMPLETE_DJ,
                'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.JURIDICO, SIRHA.ROLE.TECNICO, SIRHA.ROLE.UNIDAD]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.INCOMPLETE_DT,
                'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.TECNICO, SIRHA.ROLE.UNIDAD]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.PENDING_RENOV_LICENSE,
                'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.ADMINISTRATIVO]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.PENDING_REVIEW_DIR,
                'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.DIRECCION, SIRHA.ROLE.JURIDICO]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.PENDING_REVIEW_DJ,
                'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.TECNICO, SIRHA.ROLE.JURIDICO, SIRHA.ROLE.UNIDAD]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.PENDING_TECH_DECISION,
                'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.TECNICO, SIRHA.ROLE.UNIDAD]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.PENDING_EMIT_LICENSE,
                'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.JURIDICO]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.PENDING_DIR_SIGN,
                'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.DIRECCION, SIRHA.ROLE.JURIDICO]
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.DE_FACTO,
                'roles': []
            },
            {
                'key': Backbone.SIXHIARA.EstadoRenovacao.PENDING_DADOS_LICENSE,
                'roles': [SIRHA.ROLE.ADMIN, SIRHA.ROLE.OBSERVADOR, SIRHA.ROLE.JURIDICO]
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
        var role = wfr.getMainRole();
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
