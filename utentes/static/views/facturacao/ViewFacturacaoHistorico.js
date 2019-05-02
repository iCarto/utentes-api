Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFacturacaoHistorico = Backbone.View.extend({

    className: 'view-facturacao',

    id: 'facturacao-historico-view',
    template: _.template(`
        <div class="panel panel-info">
            <div class="panel-heading">
                <h3 class="panel-title"><strong>Histórico</strong></h3>
            </div>
            <div class="panel-body row">
                <ul id="historico" class="facturacao-historico">
                </ul>
            </div>
        </div>
    `),

    initialize: function (options) {
        this.options = options || {};
    },

    render: function() {
        this.$el.empty();
        this.$el.append(this.template());
        this.renderFacturaCollection();
        return this;
    },

    renderFacturaCollection() {
        var self = this;
        if(this.model) {
            var container = document.createDocumentFragment();
            this.facturasViews = this.model.map(this.createFacturaHistoricoView);
            this.facturasViews.forEach(function(facturaView){
                facturaView.on('factura-selected', function(id) {
                    self.trigger('factura-selected', id);
                    self.setSelected(id);
                })
                container.appendChild(facturaView.render().el)
            });
            this.$el.find("#historico").empty().append(container);
        }
    },

    createFacturaHistoricoView: function(factura) {
        return new Backbone.SIXHIARA.ViewFacturaHistorico({ model: factura });
    },

    setSelected: function(id) {
        for(var i=0; i<this.facturasViews.length; i++) {
            var facturaModel = this.facturasViews[i].model;
            if(facturaModel.id == id) {
                this.facturasViews[i].setSelected();
            }else{
                this.facturasViews[i].removeSelected();
            }
        }
    }

});
