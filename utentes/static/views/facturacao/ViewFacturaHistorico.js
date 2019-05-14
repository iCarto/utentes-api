Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFacturaHistorico = Backbone.View.extend({

    className: 'factura-historico',
    tagName: 'li',

    template: _.template(`
        <small class="label" id="summary_pagos">P</small>
        <a href="#" id="view-link"><strong><%- mes + '/' +  ano %></strong>.&nbsp;Valor:&nbsp;<%- (formatter().formatNumber(pago_iva, '0[.]00') || '-') %>&nbsp;MZN</a>
        <ul>
            <li>Subterrânea:&nbsp;<%- (formatter().formatNumber(consumo_fact_sub, '0[.]00') || '-') %>&nbsp;m<sup>3</sup></li>
            <li>Superficial:&nbsp;<%- (formatter().formatNumber(consumo_fact_sup, '0[.]00') || '-') %>&nbsp;m<sup>3</sup></li>
        </ul>
    `),

    events: {
        'click #view-link': 'viewFactura',
    },

    initialize: function (options) {
        this.options = options || {};
        this.listenTo(this.model, 'change', this.render)
    },

    render: function() {
        var json = this.model.toJSON();
        this.$el.empty();
        this.$el.html(this.template(json));
        this.$el.find('#summary_pagos').removeClass().addClass('label ' + this.getStatusClassname());
        return this;
    },

    setSelected: function() {
        this.$el.addClass('factura-selected');
    },

    removeSelected: function() {
        this.$el.removeClass('factura-selected');
    },

    viewFactura: function() {
        this.trigger('factura-selected', this.model.id);
    },

    getStatusClassname: function(){
        var fact_estado = this.model.get('fact_estado');
        if(fact_estado === window.SIRHA.ESTADO_FACT.PENDING_M3) {
            return 'factura-label-pdt-consumo';
        }else if(fact_estado === window.SIRHA.ESTADO_FACT.PENDING_INVOICE){
            return 'factura-label-pdt-factura';
        }else if(fact_estado === window.SIRHA.ESTADO_FACT.PENDING_PAY){
            return 'factura-label-pdt-pagamento';
        }else if(fact_estado === window.SIRHA.ESTADO_FACT.PAID){
            return 'factura-label-pagada';
        }
    }

});
