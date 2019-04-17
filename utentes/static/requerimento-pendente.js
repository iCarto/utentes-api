var where = new Backbone.SIXHIARA.Where();
var exploracaos = new Backbone.SIXHIARA.ExploracaoCollection();
var exploracaosFiltered = new Backbone.SIXHIARA.ExploracaoCollection();
var domains = new Backbone.UILib.DomainCollection();
var estados = new Backbone.SIXHIARA.EstadoCollection();
var listView, mapView, numberOfResultsView, filtersView;

exploracaos.url = Backbone.SIXHIARA.Config.apiRequerimentos;

var domainsFetched = function(collection, response, options) {
    filtersView = new Backbone.SIXHIARA.FiltersView({
        el: $('#filters'),
        model: where,
        domains: domains,
        states: estados.forPendentesFilterView(),
    }).render();

    if (filtersView && exploracaos.length) {
        filtersView.setDataFilterFromExploracaos(exploracaos);
    }

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
        numberOfResultsView.update(_.size(exploracaosFiltered));

        var currentModel = wf.activeView && wf.activeView.model;
        var thereAreAvailableExps = exploracaosFiltered.length > 0;
        if (currentModel) {
            // Si se está mostrando una exp y tras el filtrado la exp no está en la lista
            // hay que mostrar la siguiente que toque
            var nextExp = exploracaosFiltered.where({'exp_id': wf.activeView.model.get('exp_id')});
            if (nextExp.length === 0) {
                wf.renderView(nextExpToShow());
            }
        } else if (thereAreAvailableExps) {
            // Si no se estaba mostrando ninguna pero la lista no está vacía
            // hay que mostrar la siguiente que toque
            wf.renderView(nextExpToShow());
        } else {
            wf.renderView(null);
        }

        if (!wf.activeView || !wf.activeView.model) {
            wf.renderView(null);
        } else {
            var nextExp = exploracaosFiltered.where({'exp_id': wf.activeView.model.get('exp_id')});
            if (nextExp.length === 0) {
                wf.renderView(nextExpToShow());
            }
        }

    });
};

var exploracaosFetched = function() {

    exploracaosFiltered = new Backbone.SIXHIARA.ExploracaoCollection(exploracaos.models);

    if (filtersView && exploracaos.length) {
        filtersView.setDataFilterFromExploracaos(exploracaos);
    }

    listView = new Backbone.UILib.ListView({
        el: $('#project_list'),
        collection: exploracaosFiltered,
        subviewTemplate: _.template($('#exploracao-li-tmpl').html())
    });

    numberOfResultsView = new Backbone.SIXHIARA.NumberOfResultsView({
        el: $('#projects-header .results'),
        totalResults: _.size(exploracaos)
    });

    new Backbone.SIXHIARA.ButtonExportXLSView({
        el: $('#projects-header .export-buttons'),
        listView: listView,
    }).render();

    new Backbone.SIXHIARA.ButtonExportSHPView({
        el: $('#projects-header .export-buttons'),
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

    if (exploracaosFiltered.length > 0) {
        wf.renderView(exploracaosFiltered.at(0));
        $('#map-container a[href="#insert-data-tab"]').tab('show');
    }

    exploracaos.on('show-next-exp', function(model) {
        var state = model.get('estado_lic');
        if (estados.where({'text': state}).length === 0) {
            exploracaos.remove(model);
            where.set('mapBounds', null, {silent:true});
            exploracaosFiltered = exploracaos.filterBy(where);
            listView.listenTo(exploracaosFiltered, 'leaflet', myLeafletEvent);
        }
        listView.update(exploracaosFiltered);
        mapView.update(exploracaosFiltered);
        var nextExp = nextExpToShow(exploracaos, exploracaosFiltered, model.get('exp_id'), state);
        wf.renderView(nextExp);
    });

};

estados.fetch({
    success: function() {
        estados = estados.forPendentesView();
        var params = $.param({
            'states': estados.pluck('text'),
        });
        exploracaos.fetch({
            parse: true,
            success: exploracaosFetched,
            data: params,
        });
        domains.fetch({
            success: domainsFetched,
        });
    }
});

document.getElementById('projects').addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'a') {
        var exp_id = e.target.parentNode.parentNode.id.replace('exp_id-', '');
        var exp = exploracaos.findWhere({'exp_id': exp_id});
        wf.renderView(exp);
        $('#map-container a[href="#insert-data-tab"]').tab('show')
    }
    return false;
});
