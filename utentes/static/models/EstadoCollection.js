Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.EstadoCollection = Backbone.UILib.DomainCollection.extend({
    url: "/api/domains/licencia_estado",
    model: Backbone.SIXHIARA.Estado,

    forPage: function(qparams) {
        if (qparams.has("em_processo")) {
            return this._forEmProcesoPage();
        } else if (qparams.has("ambos_usos")) {
            return this._forExploracaosPage();
        } else {
            return this._forLicencasPage();
        }
    },

    _forEmProcesoPage: function() {
        var estadosFiltered = this.filter(function(e) {
            return e.get("parent") !== "post-licenciada";
        });
        return new Backbone.SIXHIARA.EstadoCollection(estadosFiltered);
    },

    _forExploracaosPage: function() {
        var estadosFiltered = this.filter(function(e) {
            return e.get("parent") === "post-licenciada";
        });
        return new Backbone.SIXHIARA.EstadoCollection(estadosFiltered);
    },

    _forLicencasPage: function() {
        if (!window.SIRHA.is_single_user_mode()) {
            var estadosFiltered = this.filter(function(e) {
                return (
                    e.get("parent") === "post-licenciada" &&
                    e.get("text") !== SIRHA.ESTADO.USOS_COMUNS
                );
            });
            return new Backbone.SIXHIARA.EstadoCollection(estadosFiltered);
        } else {
            return new Backbone.SIXHIARA.EstadoCollection(this.models);
        }
    },

    forPendentesView: function() {
        if (!window.SIRHA.is_single_user_mode()) {
            var states = this.availablePendentesStates();
            var foo = this.filter(function(e) {
                return states.indexOf(e.get("text")) !== -1;
            });
            return new Backbone.SIXHIARA.EstadoCollection(foo);
        } else {
            return new Backbone.SIXHIARA.EstadoCollection(this.models);
        }
    },

    availablePendentesStates: function() {
        var states = SIXHIARA.ESTADOS_PENDENTES.filter(function(s) {
            return iAuth.user_roles_in(s.roles, "not-safe");
        });
        states = states.map(function(s) {
            return s.key;
        });
        return states;
    },
});
