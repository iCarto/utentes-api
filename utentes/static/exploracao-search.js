var where = new Backbone.SIXHIARA.Where();
var exploracaos = new Backbone.SIXHIARA.ExploracaoCollection();
var exploracaosFiltered = new Backbone.SIXHIARA.ExploracaoCollection();
var domains = new Backbone.UILib.DomainCollection();
var estados = new Backbone.SIXHIARA.EstadoCollection();
var listView, mapView, numberOfResultsView, filtersView;

var setUtentesFilterFromExploracaos = function() {
    var utentesListFromExploracaos = getUtentesList(exploracaos);
    if(filtersView) {
        filtersView.setUtentesFilter(utentesListFromExploracaos);
    }
};

var getUtentesList = function(exploracaos) {
    var utentesFilterList = exploracaos
        .reject(function(exploracao){
            return !exploracao.get('utente') || !exploracao.get('utente').get('id');
        })
        .map(function(exploracao){
            var utente = exploracao.get('utente');
            return new Backbone.UILib.Domain({
                'category': 'utente',
                'text': utente.get('nome'),
            });
        });
    utentesFilterList.unshift(new Backbone.UILib.Domain({
        'orden': 0
    }));
    return new Backbone.UILib.DomainCollection(utentesFilterList);
};

var domainsFetched = function(collection, response, options) {
    filtersView = new Backbone.SIXHIARA.FiltersView({
        el: $('#filters'),
        model: where,
        domains: domains,
        states: estados.length ? estados.forSearchFilterView() : undefined,
    }).render();
    this.setUtentesFilterFromExploracaos();

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
    });
};

var exploracaosFetched = function() {

    exploracaosFiltered = new Backbone.SIXHIARA.ExploracaoCollection(exploracaos.models);
    this.setUtentesFilterFromExploracaos();

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
};

var estadosFetched = function(estados) {
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
};

var qparams = new URLSearchParams(document.location.search.substring(1));
if (qparams.has('em_processo')) {
    estados.fetch({
        success: function() {
            var estadosFiltered = estados.filter(function(model){
                return model.get('parent') !== 'post-licenciada';
            })
            estados = new Backbone.SIXHIARA.EstadoCollection(estadosFiltered);
            estadosFetched(estados);
        },
    });
} else {
    estados.fetch({
        success: function() {
            estados = estados.forSearchView();
            estadosFetched(estados);
        },
    });
}
