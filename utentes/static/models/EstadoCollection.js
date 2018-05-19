Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.EstadoCollection = Backbone.UILib.DomainCollection.extend({

    url: '/api/domains/licencia_estado',
    model: Backbone.SIXHIARA.Estado,

    initialize: function(options) {
        this.options = options || {};
    },

    forSearchView: function() {
        var ara = this.getARA();

        if (ara === 'ARAS') {
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
        var ara = this.getARA();

        if (ara === 'ARAS') {
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

    getARA: function() {
        if (!Backbone.SIXHIARA.EstadoCollection.ara) {
            this.ara = this.byCategory('ara').at(0).get('key');
            Backbone.SIXHIARA.EstadoCollection.ara = this.ara;
        }
        return Backbone.SIXHIARA.EstadoCollection.ara;
    },

    available: function(data) {
        var state = model.get('estado_lic');
        return this.where({'text': state}).length > 0;
    },
});

var ESTADOS_PENDENTES = [
    {
        'key': 'Não existe',
        'roles': [],
    },
    {
        'key': 'Não aprovada',
        'roles': [],
    },
    {
        'key': 'Irregular',
        'roles': []
    },
    {
        'key': 'Licenciada',
        'roles': []
    },
    {
        'key': 'Desconhecido',
        'roles': []
    },
    {
        'key': 'Documentação incompleta (Pendente utente - D. Adm)',
        'roles': [ROL_ADMIN, ROL_ADMINISTRATIVO]
    },
    {
        'key': 'Documentação incompleta (Pendente utente - Direcção)',
        'roles': [ROL_ADMIN, ROL_DIRECCION]
    },
    {
        'key': 'Documentação incompleta (Pendente utente - D. Jur)',
        'roles': [ROL_ADMIN, ROL_JURIDICO, ROL_TECNICO]
    },
    {
        'key': 'Documentação incompleta (Pendente utente - R. Cad DT)',
        'roles': [ROL_ADMIN, ROL_TECNICO]
    },
    {
        'key': 'Documentação incompleta (Pendente utente - D. Fin)',
        'roles': [ROL_ADMIN, ROL_FINANCIERO]
    },
    {
        'key': 'Pendente Revisão Pedido Licença (Direcção)',
        'roles': [ROL_ADMIN, ROL_DIRECCION]
    },
    {
        'key': 'Pendente Análise Pedido Licença (D. Jur)',
        'roles': [ROL_ADMIN, ROL_TECNICO, ROL_JURIDICO]
    },
    {
        'key': 'Pendente Visita Campo (R. Cad DT)',
        'roles': [ROL_ADMIN, ROL_TECNICO]
    },
    {
        'key': 'Pendente Parecer Técnico (R. Cad DT)',
        'roles': [ROL_ADMIN, ROL_TECNICO]
    },
    {
        'key': 'Pendente Emisão Licença (D. Jur)',
        'roles': [ROL_ADMIN, ROL_JURIDICO]
    },
    {
        'key': 'Pendente Firma Licença (Direcção)',
        'roles': [ROL_ADMIN, ROL_DIRECCION]
    },
    {
        'key': 'Utente de facto',
        'roles': []
    },
];
