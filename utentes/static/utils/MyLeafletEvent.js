var myLeafletEvent = function(e) {
    var item = document.getElementById('exp_id-' + e.exp_id);
    if (item) {
        item = item.parentNode;
    } else {
        return;
    }
    if (e.type === 'mouseover') {
        e.notscroll || item.scrollIntoView();
        item.classList.add('leaflet-mouseover');
    } else {
        item.classList.remove('leaflet-mouseover');
    }
};
