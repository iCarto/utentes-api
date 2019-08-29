var where = new Backbone.SIXHIARA.Where();
var exploracaos = new Backbone.SIXHIARA.ExploracaoCollection();
var exploracaosFiltered = new Backbone.SIXHIARA.ExploracaoCollection();
var domains = new Backbone.UILib.DomainCollection();
var estados = new Backbone.SIXHIARA.EstadoCollection();
var listView, mapView, numberOfResultsView, filtersView;

var domainsFetched = function(collection, response, options) {
    filtersView = new Backbone.SIXHIARA.FiltersView({
        el: $("#filters"),
        model: where,
        domains: domains,
        states: estados,
    }).render();

    if (filtersView && exploracaos.length) {
        filtersView.setDataFilterFromExploracaos(exploracaos);
    }

    exploracaos.listenTo(where, "change", function(model, options) {
        if (!model) return;
        var keys = _.keys(model.changed);

        if (keys.length === 1 && keys.indexOf("mapBounds") !== -1) {
            exploracaosFiltered = exploracaos.filterBy(where);
            listView.listenTo(exploracaosFiltered, "leaflet", myLeafletEvent);
            listView.update(exploracaosFiltered);
        } else {
            // Reset geo filter if the user use any other filter
            where.set("mapBounds", null, {silent: true});
            exploracaosFiltered = exploracaos.filterBy(where);
            listView.listenTo(exploracaosFiltered, "leaflet", myLeafletEvent);
            listView.update(exploracaosFiltered);
            mapView.update(exploracaosFiltered);
        }
        numberOfResultsView.update(_.size(exploracaosFiltered));
    });
};

var exploracaosFetched = function() {
    exploracaosFiltered = new Backbone.SIXHIARA.ExploracaoCollection(
        exploracaos.models
    );

    if (filtersView && exploracaos.length) {
        filtersView.setDataFilterFromExploracaos(exploracaos);
    }

    listView = new Backbone.UILib.ListView({
        el: $("#project_list"),
        collection: exploracaosFiltered,
        subviewTemplate: _.template($("#exploracao-li-tmpl").html()),
    });

    numberOfResultsView = new Backbone.SIXHIARA.NumberOfResultsView({
        el: $("#projects-header .results"),
        totalResults: _.size(exploracaos),
    });

    new Backbone.SIXHIARA.ButtonExportXLSView({
        el: $("#projects-header .export-buttons"),
        listView: listView,
    }).render();

    new Backbone.SIXHIARA.ButtonExportSHPView({
        el: $("#projects-header .export-buttons"),
        listView: listView,
    }).render();

    mapView = new Backbone.SIXHIARA.MapView({
        el: $("#map"),
        collection: exploracaosFiltered,
        where: where,
    });

    listView.listenTo(exploracaosFiltered, "leaflet", myLeafletEvent);
    listView.update(exploracaosFiltered);
    mapView.update(exploracaosFiltered);
};

var estadosFetched = function(estados) {
    var params = $.param({
        states: estados.pluck("text"),
    });
    exploracaos.fetch({
        parse: true,
        success: exploracaosFetched,
        data: params,
    });
    domains.fetch({
        success: domainsFetched,
    });
};

estados.fetch({
    success: function() {
        var qparams = new URLSearchParams(document.location.search.substring(1));
        estados = estados.forPage(qparams);
        estadosFetched(estados);
    },
});
