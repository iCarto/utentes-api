Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.FacturaCollection = Backbone.Collection.extend({

    model: Backbone.SIXHIARA.Factura,
    
    initialize: function(models, options) {
        options || (options = {});
        this.completed = !(models && models.some(function(model) {
            return model.fact_estado != window.SIRHA.ESTADO_FACT.PAYED;
        }));
    },

    comparator: function( a, b) {
        var mes_a = a.get('mes');
        var ano_a = a.get('ano');
        var mes_b = b.get('mes');
        var ano_b = b.get('ano');

        if(mes_a > mes_b) return -1;
        else if(mes_a < mes_b) return 1;
        else return 0;
    }

});
