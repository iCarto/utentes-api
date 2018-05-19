Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.FiltersView = Backbone.UILib.BaseView.extend({

    initialize: function(options){
        Backbone.UILib.BaseView.prototype.initialize.call(this);

        this.options = options || {};
        domains = this.options.domains || new Backbone.UILib.DomainCollection();

        // properties
        var utentes = domains.byCategory('utente');
        var licenciaTipoAgua = domains.byCategory('licencia_tipo_agua');
        var licenciaEstados = this.options.states || domains.byCategory('licencia_estado');
        var exploracaoPagamento = domains.byCategory('pagamentos');
        var actividades = domains.byCategory('actividade');

        // updates the model
        this.addView(new Backbone.UILib.WidgetsView({
            el: this.$el,
            model: this.model
        }));

        // select views
        this.addView(
    new Backbone.SIXHIARA.SelectLocationView({
        domains: domains,
        model: this.model,
        domainsKeys: ['provincia', 'distrito', 'posto'],
        el: this.$el,
    })
    );
        this.addView(new Backbone.UILib.SelectView({
            el: this.$('#utente'),
            collection: utentes
        }));

        this.addView(new Backbone.UILib.SelectView({
            el: this.$('#tipo_agua'),
            collection: licenciaTipoAgua
        }));

        this.addView(new Backbone.UILib.SelectView({
            el: this.$('#estado'),
            collection: licenciaEstados
        }));

        this.addView(new Backbone.UILib.SelectView({
            el: this.$('#pagos'),
            collection: exploracaoPagamento
        }));

        this.addView(new Backbone.UILib.SelectView({
            el: this.$('#actividade'),
            collection: actividades
        }));
    },

});
