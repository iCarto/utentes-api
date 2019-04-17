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
