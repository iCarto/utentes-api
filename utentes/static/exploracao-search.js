var where = new Backbone.SIXHIARA.Where();
var exploracaos = new Backbone.SIXHIARA.ExploracaoCollection();
var exploracaosFiltered = new Backbone.SIXHIARA.ExploracaoCollection();
var domains = new Backbone.UILib.DomainCollection();
var estados = new Backbone.SIXHIARA.EstadoCollection();
var listView, mapView;

var domainsFetched = function(collection, response, options) {
    new Backbone.SIXHIARA.FiltersView({
        el: $('#filters'),
        model: where,
        domains: domains,
        states: estados.length ? estados.forSearchFilterView() : undefined,
    }).render();
    exploracaos.listenTo(where, 'change', function(model, options){
        if (!model) return;
        var keys = _.keys(model.changed);

        if ((keys.length === 1) && (keys.indexOf('mapBounds') !== -1)) {
            exploracaosFiltered = exploracaos.filterBy(where);
            listView.listenTo(exploracaosFiltered, 'leaflet', myLeafletEvent);
            listView.update(exploracaosFiltered);
        } else {
            // Reset geo filter if the user use any other filter
            where.set('mapBounds', null, {silent:true});
            exploracaosFiltered = exploracaos.filterBy(where);
            listView.listenTo(exploracaosFiltered, 'leaflet', myLeafletEvent);
            listView.update(exploracaosFiltered);
            mapView.update(exploracaosFiltered);
        }
    });
};

var exploracaosFetched = function() {

    exploracaosFiltered = new Backbone.SIXHIARA.ExploracaoCollection(exploracaos.models);

    listView = new Backbone.UILib.ListView({
        el: $('#project_list'),
        collection: exploracaosFiltered,
        subviewTemplate: _.template($('#exploracao-li-tmpl').html())
    });

    new Backbone.SIXHIARA.ButtonExportXLSView({
        el: $('#projects h1'),
        listView: listView,
    }).render();

    new Backbone.SIXHIARA.ButtonExportSHPView({
        el: $('#projects h1'),
        listView: listView,
    }).render();

    mapView = new Backbone.SIXHIARA.MapView({
        el: $('#map'),
        collection: exploracaosFiltered,
        where: where,
    });

    listView.listenTo(exploracaosFiltered, 'leaflet', myLeafletEvent);
    listView.update(exploracaosFiltered);
    mapView.update(exploracaosFiltered);
};

var estadosFetched = function(params) {
    exploracaos.fetch({
        parse: true,
        success: exploracaosFetched,
        data: params,
    });
    domains.fetch({
        success: domainsFetched,
    });
};

var qparams = new URLSearchParams(document.location.search.substring(1));
if (qparams.has('all')) {
    estados.fetch({
        success: function() {
            var estadosFiltered = estados.filter(function(model){
                return model.get('parent') !== 'post-licenciada' ;
            })
            estados = new Backbone.SIXHIARA.EstadoCollection(estadosFiltered);
            var params = $.param({
                'states': estados.pluck('text'),
            });
            estadosFetched(params);
        },
    });
} else {
    estados.fetch({
        success: function() {
            estados = estados.forSearchView();
            var params = $.param({
                'states': estados.pluck('text'),
            });
            estadosFetched(params);
        },
    });
}
