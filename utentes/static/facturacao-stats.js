var facturaStatsFilter = new Backbone.SIXHIARA.FacturaStatsFilter();
var facturaStatsCollection = new Backbone.SIXHIARA.FacturaStatsCollection(null, {
    filter: facturaStatsFilter
});

var facturacaoStatsView = new Backbone.SIXHIARA.ViewFacturacaoStats({
    el: $('main'),
    model: facturaStatsCollection
});

$(document).ready(function() {
    facturaStatsCollection.fetch({
        parse: true,
        success: function(){
            facturacaoStatsView.render();
        },
        error: function(){
            window.location = Backbone.SIXHIARA.Config.urlSearch;
        }
    });
});