Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.FacturaCollection = Backbone.Collection.extend({

    model: Backbone.SIXHIARA.Factura,
    
    initialize: function(models, options) {
        options || (options = {});
        this.completed = !(models && models.some(function(model) {
            return model.fact_estado != window.SIRHA.ESTADO_FACT.PAID;
        }));
    },

    comparator: function( a, b) {
        var mes_a = a.get('mes');
        var ano_a = a.get('ano');
        var mes_b = b.get('mes');
        var ano_b = b.get('ano');

        if(ano_a != ano_b) {
            return ano_b.localeCompare(ano_a);
        }else if(mes_a != mes_b) {
            return mes_b.localeCompare(mes_a);
        }else{
            return 0;
        }
    }

});
