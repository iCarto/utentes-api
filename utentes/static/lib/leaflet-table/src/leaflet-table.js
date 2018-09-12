L.Control.Table = L.Control.extend({
    options: {
        position:       'topright',
        featIdProp:     'fid', // be sure it doesn't conflict with a GeoJSON property
        featCodeProp:   'name', // values in this prop are expected to be id-order
        featOrderProp:  'order',
        featCodeTitle:  'Código',
        featOrderTitle: 'Orden',
        unselectedFeature: {
            radius:      8,
            fillColor:   "#ff7800",
            color:       "#000",
            weight:      1,
            opacity:      .4,
            fillOpacity: 0.4
        },
        selectedFeature: {
            radius:      8,
            fillColor:   "#F00",
            color:       "#000",
            weight:      1,
            opacity:     1,
            fillOpacity: 0.8
        }
    },

    initialize: function(geoJsonLayer, options) {
        this.geoJsonLayer = geoJsonLayer;
        this.selection = new Map();
        L.Util.setOptions(this, options);

        var unselect = this.options.unselectedFeature;
        this.polygonLayer = L.geoJson([],
            {
                pointToLayer: function(feature, latlng){
                    return L.circleMarker(latlng, unselect);
                },
                onEachFeature: function(feature, layer){
                    // on adding each feat
                },
            }
    ).addTo(map);

        map.on("moveend", this.saveMapView, this);
    },

    onAdd: function(map){
        if (window.localStorage.getItem("gpxData")){
            var points = this.getDataFromLocalStorage();
            var myGeoJSON = this.layerFromPoints(points);
            this.geoJsonLayer.addData(myGeoJSON);
        } else {
            this.disableSessionButton();
        }

        if (window.localStorage.getItem("mapView")){
            this.loadMapView();
        }



        var codeTitle = this.options.featCodeTitle;
        var orderTitle = this.options.featOrderTitle;

        // create table container
        var container = L.DomUtil.create('div', 'table-container');
        var table = this.table = L.DomUtil.create('table', 'scrollable', container);
        var thead = this.thead = L.DomUtil.create('thead', '', table);
        var tbody = this.tbody = L.DomUtil.create('tbody', '', table);

        // header
        var header = '<thead><tr>';
        header    += '<th><strong>' + codeTitle + '</strong></th>';
        header    += '<th><strong>' + orderTitle + '</strong></th>';
        header    += '</tr></thead>';
        thead.innerHTML = header;

        // fill table with rows, if geoJsonLayer group has any layer
        var control = this;
        this.geoJsonLayer.eachLayer(function(layer){
            control.doAddRow(table, layer);
        });
        L.DomUtil.setOpacity(this.table, .7);

        // set events
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.addListener(this.table, 'click', this.selectByRow, this);
        L.DomEvent.addListener(this.table, 'dblclick', this.editByRow, this);
        this.geoJsonLayer.on('click', this.selectByFeature, this);
        // this.geoJsonLayer.on('dblclick', this.editByFeature, this);
        this.geoJsonLayer.on('layeradd', this.addRow, this);
        this.geoJsonLayer.on('layerremove', this.removeRow, this);

        return container;
    },

    onRemove: function(map){
        // unset events
        L.DomEvent.removeListener(this.table, 'click', this.selectRow, this);
        L.DomEvent.removeListener(this.table, 'dblclick', this.editRow, this);
        this.geoJsonLayer.off('click', this.selectByFeature, this);
        // this.geoJsonLayer.off('dblclick', this.editByFeature, this);
        this.geoJsonLayer.off('layeradd', this.addRow, this);
        this.geoJsonLayer.off('layerremove', this.removeRow, this);
    },

    deleteSelected: function(){
        this.selection.forEach(function(value, key, map){
            this.geoJsonLayer.removeLayer(value.properties[this.options.featIdProp]);
        }, this);
        this.saveToLocalStorage();
        this.selection.clear();
    },

    moveToTop: function(){
        // TODO: keep sorting strategy for selected rows
        var firstTR = this.tbody.firstChild;
        var tbody = this.tbody;
        this.selection.forEach(function(value, key){
            var rowToMove = L.DomUtil.get('fid-' + key);
            tbody.insertBefore(rowToMove, firstTR);
        });
    },

    clear: function(){
        // clear selection
        var control = this;
        this.selection.forEach(function(value, key){
            control.unstyleRow(key);
            control.unstyleFeature(key); // this would delete selection id
        });
        // clear new polygon layer
        this.polygonLayer.clearLayers();
    },

    selectByRow: function(e){
        var cell = e.target;
        if(cell.id === (undefined || '')){
            return;
        }
        // id equals to 'fid-123-celltype'
        var fid = parseInt(cell.id.split('-')[1]);
        var row = cell.parentElement;
        if(L.DomUtil.hasClass(row, 'selected')){
            L.DomUtil.removeClass(row, 'selected');
            this.unstyleFeature(fid);
        } else{
            L.DomUtil.addClass(row, 'selected');
            this.styleFeature(fid);
        }
    },

    selectByFeature: function(e){
        var fidProp = this.options.featIdProp;
        var fid = e.layer.feature.properties[fidProp];

        var unselect = this.options.unselectedFeature;
        var select = this.options.selectedFeature;
        if(e.layer.options.fillColor === select.fillColor){ // it is selected
            e.layer.setStyle(unselect);
            this.unstyleRow(fid);
            this.selection.delete(fid);
        } else { // it is not selected
            e.layer.setStyle(select);
            this.styleRow(fid);
            this.selection.set(fid, e.layer.feature);
        }
    },

    styleFeature: function(fid){
        var fidProp = this.options.featIdProp;
        var selection = this.selection;
        var select = this.options.selectedFeature;
        this.geoJsonLayer.eachLayer(function(layer){
            if(fid === layer.feature.properties[fidProp]){
                layer.setStyle(select);
                selection.set(fid, layer.feature);
            }
        });
    },

    unstyleFeature: function(fid){
        var fidProp = this.options.featIdProp;
        var selection = this.selection;
        var control = this;
        var unselect = this.options.unselectedFeature;
        this.geoJsonLayer.eachLayer(function(layer){
            if(fid === layer.feature.properties[fidProp]){
                layer.setStyle(unselect);
                selection.delete(fid);
            }
        });
    },

    styleRow: function(fid){
        var row = L.DomUtil.get('fid-' + fid);
        L.DomUtil.addClass(row, 'selected');
    },

    unstyleRow: function(fid){
        var row = L.DomUtil.get('fid-' + fid);
        L.DomUtil.removeClass(row, 'selected');
    },

    addRow: function(e){
        this.doAddRow(this.table, e.layer);
    },

    doAddRow: function(table, layer){
        var fid = this.options.featIdProp,
            code    = this.options.featCodeProp,
            order   = this.options.featOrderProp;

        // add id
        var props    = layer.feature.properties;
        props[fid]   = layer._leaflet_id;
        var lastIdxOfDash = props[code].lastIndexOf('-');
        if ( lastIdxOfDash !== -1 ) {
            props[order] = props[code].substring(lastIdxOfDash + 1);
            props[code] = props[code].substring(0, lastIdxOfDash);
        } else {
            props[order] = ''
        }

        // add row
        var newRow = this.tbody.insertRow();
        newRow.setAttribute('id', 'fid-' + props[fid]);
        var cellId = newRow.insertCell();
        cellId.setAttribute('id', 'fid-' + props[fid] + '-id');
        cellId.appendChild(document.createTextNode(props[code]));
        var cellOrder = newRow.insertCell();
        cellOrder.setAttribute('id', 'fid-' + props[fid] + '-order');
        cellOrder.appendChild(document.createTextNode(props[order]));
        this.saveToLocalStorage();
    },

    removeRow: function(e){
        var row = L.DomUtil.get('fid-' + e.layer._leaflet_id);
        this.table.deleteRow(row.rowIndex);
    },

    editByRow: function(e){
        var cell = e.target;
        if(cell.id === (undefined || '')){
            return;
        }

        // don't let two popups to be opened simultaneously
        if(L.DomUtil.get('editPopup')){
            this.closePopup();
        }

        var panel = "<div id='editPopup' class='edit_text_dialog'>" +
    "<textarea id='textAreaEditPopup'>" + e.target.textContent + "</textarea>" +
    "<div>" +
    "<button id='cancelEditPopup'>Cancelar</button>" +
    // "<span class='left' style='min-width: 10px'> | </span>" +
    // "<button class='left' id='saveEditPopup'>Guardar</button>" +
    "</div>" +
    "</div>";

        e.target.innerHTML = panel + e.target.innerHTML;
        document.getElementById('textAreaEditPopup').select();

        var control = this;
        document.getElementById('textAreaEditPopup').addEventListener('keypress', function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){ // ENTER key was pressed
                control.saveValueInRowAndCell(cell.id);
            }
        });

        // document.getElementById("saveEditPopup").addEventListener("click", function( event ) {
        //   control.saveValueInRowAndCell(cell.id);
        // }, false);

        document.getElementById("cancelEditPopup").addEventListener("click", function( event ) {
            control.closePopup();
        }, false);

    },

    closePopup: function(){
        L.DomUtil.get('editPopup').remove();
    },

    saveValueInRowAndCell: function(cellId){
        var newValue = L.DomUtil.get('textAreaEditPopup').value;

        // edit table row value
        L.DomUtil.get(cellId).textContent = newValue

        // edit layer property value
        var fid = parseInt(cellId.split('-')[1]);
        var fidProp = this.options.featIdProp;
        var codeProp = this.options.featCodeProp;
        this.geoJsonLayer.eachLayer(function(layer){
            if(fid === layer.feature.properties[fidProp]){
                layer.feature.properties[codeProp] = newValue;
            }
        });

    },

    makePolygon: function(){
        this.polygonLayer.clearLayers();
        this.polygonLayer.addData(this.getPolygonFromPoints());
        return this.polygonLayer;
    },

    saveToAPI: function(){
        // TODO: save polygon
        // this could be a extensible point for others to choose what to do

        this.deleteSelected();
    },

    getPolygonFromPoints: function(){
        // TODO: allow multipolygons and points
        var polygon = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [[]]
            }
        };

        var myarray = [];
        this.selection.forEach(function(value, key){
            myarray.push(value);
        });

        if (myarray.length < 3) return polygon;

        // if no order field is provided,
        // the array would be sorted by the order items were added to it
        var order = this.options.featOrderProp;
        myarray.sort(function(a, b){
            if(a.properties[order] < b.properties[order]){
                return -1;
            } else if (a.properties[order] > b.properties[order]){
                return 1;
            }
            return 0;
        });

        var fidProp = this.options.featIdProp;
        var codeProp = this.options.featCodeProp;
        myarray.forEach(function(feat){
            // this assumes one polygon
            polygon.geometry.coordinates[0].push([
                feat.geometry.coordinates[0],
                feat.geometry.coordinates[1]
            ]);
            // TODO: save proper code property
            // now it takes properties from last point
            polygon.properties[codeProp] = feat.properties[codeProp];
            polygon.properties[fidProp] = feat.properties[fidProp];
        });
        return polygon;
    },

    getDataFromLocalStorage: function(){
        var localStorageData = window.localStorage.getItem("gpxData");
        var parsed = JSON.parse(localStorageData);
        return parsed;
    },

    layerFromPoints: function(points){
        var gj = {
            type: 'FeatureCollection',
            features: []
        }

        points.forEach(function(point){
            gj.features.push(this.getPoint(point))
        }, this)

        return gj;
    },

    getPoint: function(node) {
        return {
            type: 'Feature',
            properties: { name: node.name },
            geometry: {
                type: 'Point',
                coordinates: node.coordinates
            }
        };
    },

    resetView: function(){
        map.setView(SIXHIARA.center, SIXHIARA.search.zoom);
    },

    saveToLocalStorage: function(){
        var myarray = [];
        this.geoJsonLayer.eachLayer(function(layer){
            myarray.push({
                name: layer.feature.properties.name,
                coordinates: layer.feature.geometry.coordinates});
        });

        window.localStorage.removeItem("gpxData");
        if (!_.isEmpty(myarray)) {
            window.localStorage.setItem("gpxData", JSON.stringify(myarray));
            this.saveMapView();
            this.enableSessionButton();
        } else {
            this.resetView();
            this.disableSessionButton();
        }
    },

    saveMapView: function(){
        var position = {
            zoom: map.getZoom(),
            center: map.getCenter()};

        window.localStorage.removeItem("mapView");
        window.localStorage.setItem("mapView", JSON.stringify(position));
    },

    loadMapView: function(){
        if (window.localStorage.getItem("mapView")) {
            var mapViewRaw = window.localStorage.getItem("mapView");
            var mapView = JSON.parse(mapViewRaw);
            map.setView(mapView.center, mapView.zoom);
        }

    },

    endSession: function(){
        this.geoJsonLayer.clearLayers();
        this.disableSessionButton();
        this.resetView();
        window.localStorage.removeItem("gpxData");
        window.localStorage.removeItem("mapView");
    },

    disableSessionButton: function(){
        $("#endSession").parent().parent().addClass("disable");
    },

    enableSessionButton: function(){
        $("#endSession").parent().parent().removeClass("disable");
    },

});

L.control.table = function(geoJsonLayer, options){
    return new L.Control.Table(geoJsonLayer, options);
}
