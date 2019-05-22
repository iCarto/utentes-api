Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFacturacaoStats = Backbone.View.extend({
    
    tagName:  'div',
    id: 'view-facturacao-stats',
    className: 'view-facturacao-stats',

    template: _.template(`
        <div class="row">
            <div id="filter" class="col-xs-2"></div>
            <div class="col-xs-10">
                <div id="table" class="col-xs-12"></div>
                <div id="chart" class="col-xs-12"></div>
            </div>
        </div>
    `),

    initialize: function (options) {
        this.options = options || {};

        this.filterView = new Backbone.SIXHIARA.ViewFacturacaoStatsFilter({
            model: this.model.options.filter
        });
        this.tableView = new Backbone.SIXHIARA.ViewFacturacaoStatsTable({
            model: this.model
        });
        this.chartView = new Backbone.SIXHIARA.ViewFacturacaoStatsChart({
            model: new Backbone.SIXHIARA.FacturaStatsCollection(this.model)
        });
        this.listenTo(this.model, 'sync', this.facturasListChanged)
        this.listenTo(this.model, 'filter', this.facturasListFilter)
        this.listenTo(this.model.options.filter, 'change', this.filterModelChanged)
    },

    render: function() {
        var json = this.model.toJSON();
        this.$el.html(this.template(json));
        this.$el.find('#filter').html(this.filterView.render().el);
        this.$el.find('#table').html(this.tableView.render().el);
        this.$el.find('#chart').html(this.chartView.render().el);
        return this;
    },

    facturasListChanged: function() {
        if(!this.filterView.areUtentesLoaded()) {
            var utentesList = this.model.map(function(exploracao) {
                return {
                    id: exploracao.get('utente_id'),
                    nome: exploracao.get('utente'),
                };
            }).sort(function(a, b) {
                return (a.nome < b.nome ? -1 : (a.nome > b.nome ? 1 : 0));  
            });
            this.filterView.updateUtentes(_.uniq(utentesList, 'nome'));
        }
    },

    facturasListFilter: function(filteredIds) {
        var newModelFiltered = this.model.clone().filter(exploracao => {
            return filteredIds.includes(exploracao.get('gid'));
        });
        this.chartView.updateModel(newModelFiltered);
    },

    filterModelChanged: function() {
        this.model.fetch();
    }

});
