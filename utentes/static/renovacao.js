var where = new Backbone.SIXHIARA.Where();
var renovacoes = new Backbone.SIXHIARA.RenovacaoCollection();
var renovacoesFiltered = new Backbone.SIXHIARA.RenovacaoCollection();
var domains = new Backbone.UILib.DomainCollection();
var estados = new Backbone.SIXHIARA.EstadoRenovacaoCollection();
var listView, mapView, numberOfResultsView, filtersView;

renovacoes.url = Backbone.SIXHIARA.Config.apiRenovacoes;

var domainsFetched = function(collection, response, options) {
    filtersView = new Backbone.SIXHIARA.FiltersView({
        el: $("#filters"),
        model: where,
        domains: domains,
        states: estados,
    }).render();

    if (filtersView && renovacoes.length) {
        filtersView.setDataFilterFromExploracaos(renovacoes);
    }

    renovacoes.listenTo(where, "change", function(model, options) {
        if (!model) return;
        var keys = _.keys(model.changed);

        if (keys.length === 1 && keys.indexOf("mapBounds") !== -1) {
            renovacoesFiltered = renovacoes.filterBy(where);
            listView.listenTo(renovacoesFiltered, "leaflet", myLeafletEvent);
            listView.update(renovacoesFiltered);
        } else {
            // Reset geo filter if the user use any other filter
            where.set("mapBounds", null, {silent: true});
            renovacoesFiltered = renovacoes.filterBy(where);
            listView.listenTo(renovacoesFiltered, "leaflet", myLeafletEvent);
            listView.update(renovacoesFiltered);
            mapView.update(renovacoesFiltered);
        }
        numberOfResultsView.update(_.size(renovacoesFiltered));
        renderNextExpOnFilterChange(wfr, renovacoesFiltered);
    });
};

var renovacoesFetched = function() {
    renovacoesFiltered = new Backbone.SIXHIARA.RenovacaoCollection(renovacoes.models);

    if (filtersView && renovacoes.length) {
        filtersView.setDataFilterFromExploracaos(renovacoes);
    }

    listView = new Backbone.UILib.ListView({
        el: $("#project_list"),
        collection: renovacoesFiltered,
        subviewTemplate: _.template($("#renovacao-li-tmpl").html()),
    });

    numberOfResultsView = new Backbone.SIXHIARA.NumberOfResultsView({
        el: $("#projects-header .results"),
        totalResults: _.size(renovacoes),
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
        collection: renovacoesFiltered,
        where: where,
    });

    listView.listenTo(renovacoesFiltered, "leaflet", myLeafletEvent);
    listView.update(renovacoesFiltered);
    mapView.update(renovacoesFiltered);

    if (renovacoesFiltered.length > 0) {
        wfr.renderView(renovacoesFiltered.at(0));
        $('#map-container a[href="#insert-data-tab"]').tab("show");
    }

    renovacoes.on("show-next-exp", function(model) {
        var state = model.get("renovacao").get("estado");
        onShowNextExp(
            model,
            state,
            estados,
            renovacoes,
            renovacoesFiltered,
            where,
            wfr,
            listView,
            mapView
        );
    });
};

estados.fetch({
    success: function() {
        estados = estados.forRenovacoesView();
        var params = $.param({
            states: estados.pluck("text"),
        });
        renovacoes.fetch({
            parse: true,
            success: renovacoesFetched,
            data: params,
        });
        domains.fetch({
            success: domainsFetched,
        });
    },
});

document.getElementById("projects").addEventListener("click", e => {
    if (e.target.tagName.toLowerCase() === "a") {
        var exp_id = e.target.parentNode.parentNode.id.replace("exp_id-", "");
        var exp = renovacoes.findWhere({exp_id: exp_id});
        wfr.renderView(exp);
        $('#map-container a[href="#insert-data-tab"]').tab("show");
    }
    return false;
});
