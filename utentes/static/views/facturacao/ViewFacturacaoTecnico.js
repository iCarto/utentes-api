Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFacturacaoTecnico = Backbone.SIXHIARA.ViewFacturacao.extend({

    widgetsToBeUsed: function() {
        var self = this;
        this.widgets = [];

        this.model.get('licencias').forEach(function(lic){
            var tipo = lic.get('tipo_agua').substring(0, 3).toLowerCase();
            document.getElementById('lic-' + tipo).classList.remove('panel-disabled');
            ['consumo_tipo_sup', 'consumo_tipo_sub', 'consumo_fact_sup', 'consumo_fact_sub'].forEach(function(w){
                if (w.endsWith(tipo)) {
                    self.widgets.push(w);
                }
            });
        });
    },
});
