Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFacturacaoStatsFilter = Backbone.View.extend({
    tagName:  'div',

    id: 'view-facturacao-filters',
    className: 'view-facturacao-filters',

    template: _.template(`
        <div class="row">
            <div class="col-xs-12">
                <div>
                    <label for="utente">Utente</label>
                    <select class="form-control widget" id="utente" multiple size="15" style="height: 100%;">
                    </select>
                </div>
            </div>
            <div class="col-xs-12">
                <div id="filter-dates-view"></div>
            </div>
            <div class="col-xs-12">
                <div>
                    <label for="tipo_agua">Tipo de Água</label>
                    <select class="form-control widget" id="tipo_agua">
                    </select>
                </div>
            </div>
        </div>
    `),

    initialize: function (options) {
        var self = this;

        this.options = options || {};

        this.datesView = new Backbone.SIXHIARA.FilterDatesView({
            model: this.model
        });

        this.domains = this.options.domains || new Backbone.UILib.DomainCollection();
        this.domains.fetch({
            success: () => this.updateTiposAgua(),
        });
    },

    updateTiposAgua: function() {
        var self = this;
        var licenciasTipoAgua = this.domains.byCategory('licencia_tipo_agua');
        licenciasTipoAgua.each(function(licenciaTipoAgua) {
            var o = new Option(licenciaTipoAgua.get('text'), licenciaTipoAgua.get('text'));
            $(o).html(licenciaTipoAgua.get('text'));
            self.$el.find("#tipo_agua").append(o);
        });
    },

    updateUtentes: function(utentes) {
        var self = this;
        this.$el.find("#utente").find('option').remove();
        utentes.forEach(function(utente) {
            var o = new Option(utente.id, utente.id);
            $(o).html(utente.nome);
            self.$el.find("#utente").append(o);
        });
    },

    areUtentesLoaded: function() {
        return $("#utente").children().length != 0;
    },

    removeListeners: function() {
        this.$("#tipo_agua").off('change');
        this.$("#utente").off('change');
    },

    setListeners: function() {
        var self = this;
        this.$("#tipo_agua").on('change', function() {
            self.model.set('tipo_agua', self.$("#tipo_agua").val());
        })
        this.$("#utente").on('change', function() {
            self.model.set('utente', self.$("#utente").val());
        })
    },

    render: function() {
        this.removeListeners();
        this.$el.html(this.template);
        this.$el.find('#filter-dates-view').html(this.datesView.render().el);
        this.setListeners();
        return this;
    },

});
