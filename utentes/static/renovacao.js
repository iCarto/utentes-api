var where = new Backbone.SIXHIARA.Where();
var renovacoes = new Backbone.SIXHIARA.RenovacaoCollection();
var renovacoesFiltered = new Backbone.SIXHIARA.RenovacaoCollection();
var domains = new Backbone.UILib.DomainCollection();
var estados = new Backbone.SIXHIARA.EstadoRenovacaoCollection();
var listView, mapView, numberOfResultsView, filtersView;

var expHandled = new Set();

var nextExpToShow = function() {
    var next = renovacoesFiltered.find(function(e){
        var exp_id = e.get('exp_id');
        return !expHandled.has(exp_id);
    });
    return next || renovacoesFiltered.at(0);
};
renovacoes.url = Backbone.SIXHIARA.Config.apiRenovacoes;


var domainsFetched = function(collection, response, options) {
    filtersView = new Backbone.SIXHIARA.FiltersView({
        el: $('#filters'),
        model: where,
        domains: domains,
        states: estados.forRenovacoesFilterView(),
    }).render();

    if (filtersView && renovacoes.length) {
        filtersView.setDataFilterFromExploracaos(renovacoes);
    }

    renovacoes.listenTo(where, 'change', function(model, options){
        if (!model) return;
        var keys = _.keys(model.changed);

        if ((keys.length === 1) && (keys.indexOf('mapBounds') !== -1)) {
            renovacoesFiltered = renovacoes.filterBy(where);
            listView.listenTo(renovacoesFiltered, 'leaflet', myLeafletEvent);
            listView.update(renovacoesFiltered);
        } else {
            // Reset geo filter if the user use any other filter
            where.set('mapBounds', null, {silent:true});
            renovacoesFiltered = renovacoes.filterBy(where);
            listView.listenTo(renovacoesFiltered, 'leaflet', myLeafletEvent);
            listView.update(renovacoesFiltered);
            mapView.update(renovacoesFiltered);
        }
        numberOfResultsView.update(_.size(renovacoesFiltered));
        var currentModel = wfr.activeView && wfr.activeView.model;
        var thereAreAvailableExps = renovacoesFiltered.length > 0;
        if (currentModel) {
            // Si se está mostrando una exp y tras el filtrado la exp no está en la lista
            // hay que mostrar la siguiente que toque
            var nextExp = renovacoesFiltered.where({'exp_id': wfr.activeView.model.get('exp_id')});
            if (nextExp.length === 0) {
                wfr.renderView(nextExpToShow());
            }
        } else if (thereAreAvailableExps) {
            // Si no se estaba mostrando ninguna pero la lista no está vacía
            // hay que mostrar la siguiente que toque
            wfr.renderView(nextExpToShow());
        } else {
            wfr.renderView(null);
        }

        if (!wfr.activeView || !wfr.activeView.model) {
            wfr.renderView(null);
        } else {
            var nextExp = renovacoesFiltered.where({'exp_id': wfr.activeView.model.get('exp_id')});
            if (nextExp.length === 0) {
                wfr.renderView(nextExpToShow());
            }
        }

    });
};

var renovacoesFetched = function() {

    renovacoesFiltered = new Backbone.SIXHIARA.RenovacaoCollection(renovacoes.models);

    if (filtersView && renovacoes.length) {
        filtersView.setDataFilterFromExploracaos(renovacoes);
    }

    listView = new Backbone.UILib.ListView({
        el: $('#project_list'),
        collection: renovacoesFiltered,
        subviewTemplate: _.template($('#renovacao-li-tmpl').html())
    });

    numberOfResultsView = new Backbone.SIXHIARA.NumberOfResultsView({
        el: $('#projects-header .results'),
        totalResults: _.size(renovacoes)
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
        collection: renovacoesFiltered,
        where: where,
    });

    listView.listenTo(renovacoesFiltered, 'leaflet', myLeafletEvent);
    listView.update(renovacoesFiltered);
    mapView.update(renovacoesFiltered);

    if (renovacoesFiltered.length > 0) {
        wfr.renderView(renovacoesFiltered.at(0));
        $('#map-container a[href="#insert-data-tab"]').tab('show');
    }

    renovacoes.on('show-next-exp', function(model) {
        var state = model.get('renovacao').get('estado');
        if (estados.where({'text': state}).length === 0) {
            console.log('length0');
            renovacoes.remove(model);
            expHandled.delete(model.get('exp_id'));
            where.set('mapBounds', null, {silent:true});
            renovacoesFiltered = renovacoes.filterBy(where);
            listView.listenTo(renovacoesFiltered, 'leaflet', myLeafletEvent);

        } else {
            expHandled.add(model.get('exp_id'));
        }

        if (wfr.hasNextStateSameRole(model, window.SIXHIARA.ESTADOS_RENOVACAO)) {
            wfr.renderView(model);
        }else {
            wfr.renderView(nextExpToShow());
        }

        listView.update(renovacoesFiltered);
        mapView.update(renovacoesFiltered);

    });

};

estados.fetch({
    success: function() {
        estados = estados.forRenovacoesView();
        var params = $.param({
            'states': estados.pluck('text'),
        });
        renovacoes.fetch({
            parse: true,
            success: renovacoesFetched,
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
        var exp = renovacoes.findWhere({'exp_id': exp_id});
        wfr.renderView(exp);
        $('#map-container a[href="#insert-data-tab"]').tab('show')
    }
    return false;
});
