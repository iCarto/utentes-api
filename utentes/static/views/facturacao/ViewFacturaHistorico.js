Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFacturaHistorico = Backbone.View.extend({

    className: 'factura-historico',
    tagName: 'li',

    template: _.template(`
        <small class="label 
        <%
            if(fact_estado === "Pendente Acrescentar Consumo (R. Cad DT)") {
                print('factura-label-pdt-consumo');
            }else if(fact_estado === "Pendente Emisão Factura (D. Fin)"){
                print('factura-label-pdt-factura');
            }else if(fact_estado === "Pendente Pagamento (Utente)"){
                print('factura-label-pdt-pagamento');
            }else if(fact_estado === "Pagada"){
                print('factura-label-pagada');
            }
        %>
        " id="summary_pagos">
        <%
            if(fact_estado === "Pendente Acrescentar Consumo (R. Cad DT)") {
                print('T');
            }else if(fact_estado === "Pendente Emisão Factura (D. Fin)"){
                print('F');
            }else if(fact_estado === "Pendente Pagamento (Utente)"){
                print('P');
            }else if(fact_estado === "Pagada"){
                print('P');
            }
        %></small>
        <a href="#" id="view-link"><strong><%- mes + '/' +  ano %></strong>. Valor com IVA: <%- (formatter().formatNumber(pago_iva, '0[.]00') || '-') %> MZN</a>
        <ul>
            <li>Subterrânea: <%- (formatter().formatNumber(consumo_fact_sub, '0[.]00') || '-') %> m<sup>3</sup></li>
            <li>Superficial: <%- (formatter().formatNumber(consumo_fact_sup, '0[.]00') || '-') %> m<sup>3</sup></li>
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
    }

});
