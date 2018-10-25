Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.FiltersView = Backbone.UILib.BaseView.extend({

    initialize: function(options){
        Backbone.UILib.BaseView.prototype.initialize.call(this);

        this.options = options || {};
        domains = this.options.domains || new Backbone.UILib.DomainCollection();

        // properties
        var utentes = domains.byCategory('utente');
        var licenciaTipoLicencia = domains.byCategory('licencia_tipo_lic');
        var licenciaTipoAgua = domains.byCategory('licencia_tipo_agua');
        var licenciaEstados = this.options.states || domains.byCategory('licencia_estado');
        var unidades = domains.byCategory('unidade');
        var actividades = domains.byCategory('actividade');

        // updates the model
        this.addView(new Backbone.UILib.WidgetsView({
            el: this.$el,
            model: this.model
        }));

        // select views
        this.addView(new Backbone.SIXHIARA.SelectLocationView({
            domains: domains,
            model: this.model,
            domainsKeys: ['provincia', 'distrito', 'posto'],
            el: this.$el,
        }));

        this.utentesView = new Backbone.UILib.SelectView({
            el: this.$('#utente'),
            collection: utentes
        });
        this.addView(this.utentesView);

        this.addView(new Backbone.UILib.SelectView({
            el: this.$('#estado'),
            collection: licenciaEstados
        }));

        this.addView(new Backbone.UILib.SelectView({
            el: this.$('#tipo_lic'),
            collection: licenciaTipoLicencia
        }));

        this.addView(new Backbone.UILib.SelectView({
            el: this.$('#tipo_agua'),
            collection: licenciaTipoAgua
        }));

        this.addView(new Backbone.UILib.SelectView({
            el: this.$('#loc_unidad'),
            collection: unidades
        }));

        this.addView(new Backbone.UILib.SelectView({
            el: this.$('#actividade'),
            collection: actividades
        }));
    },

    setUtentesFilter: function(utentes) {
        this.utentesView.update(utentes)
    }

});
