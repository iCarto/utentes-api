var onShowNextExp = function(model, state, estados, fullList, filteredList, where, wf, listView, mapView) {
    if (estados.where({'text': state}).length === 0) {
        fullList.remove(model);
        where.set('mapBounds', null, {silent:true});
    }
    filteredList = fullList.filterBy(where);
    listView.listenTo(filteredList, 'leaflet', myLeafletEvent);
    listView.update(filteredList);
    mapView.update(filteredList);

    var nextExp = nextExpToShow(fullList, filteredList, model.get('exp_id'), state);
    wf.renderView(nextExp);
};


var expHandled = new Set();
var nextExpToShow = function(fullList, filteredList, currentExpId, currentState) {
    /*
    Devuelve el elemento con el que se esté trabajando actualmente si el estado
    al que ha cambiado no es 'incompleto', y sigue pudiendo ser visualizado en
    la lista (el filtro lo permite y el estado sigue siendo del usuario)

    A efectos de trabajo efectivo podría tener sentido mantener un elemento que
    todavía está en la lista completa (el estado sigue siendo del usuario) pero
    está filtrado. Pero es un poco raro.

    Si no devuelve un elemento que no todavía no haya sido gestionado. Aquí
    otro razonamiento podría ser que al cambiar el filtro meter primero
    elementos que hayan sido gestionados.

    Si todos han sido gestionado devuelve el primero de la lista
    */
    expHandled.add(currentExpId);
    var inFullList = fullList.findWhere({'exp_id': currentExpId});
    var inFilteredList = filteredList.findWhere({'exp_id': currentExpId});
    if (!inFullList) {
        // Si ya no está en lista completa no hay necesidad de mantener este
        // elemento como ya procesado. No hay forma de volver a él.
        expHandled.delete(currentExpId);
    }

    if (inFilteredList && !currentState.includes('incompleta')) {
        return inFullList;
    }

    next = filteredList.find(function(e){
        var exp_id = e.get('exp_id');
        return !expHandled.has(exp_id);
    });
    // .at(x) devuelve undefined si el índice x no existe
    return next || filteredList.at(0);
};

var renderNextExpOnFilterChange = function(wf, filteredList) {
    var currentModel = wf.activeView && wf.activeView.model;
    var currentExpId = currentModel && currentModel.get('exp_id');
    var inFilteredList = filteredList.findWhere({'exp_id': currentExpId});
    if (inFilteredList) {
        // Si se está mostrando una exp y tras el filtrado sigue en la lista
        // no es necesario hacer nada
        return;
    }

    // Busco una exp que todavía no se haya gestionadp
    var nextExp = filteredList.find(function(e){
        var exp_id = e.get('exp_id');
        return !expHandled.has(exp_id);
    });

    // Si todas han sido gestionadas me quedo con la primera de la lista, Si la
    // lista está vacía obtendré un `undefined` que se traduce en NoDataView
    nextExp = nextExp || filteredList.at(0);

    // y muestro la que toque
    wf.renderView(nextExp);
};
