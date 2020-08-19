L.Control.Table = L.Control.extend({
    options: {
        position: "topright",
        featIdProp: "fid", // be sure it doesn't conflict with a GeoJSON property
        featCodeProp: "name", // values in this prop are expected to be id-order
        featOrderProp: "order",
        featCodeTitle: "Código",
        featOrderTitle: "Orden",
        unselectedFeature: {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 0.4,
            fillOpacity: 0.4,
        },
        selectedFeature: {
            radius: 8,
            fillColor: "#F00",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
        },
    },

    initialize: function(supportLayer, editionLayer, options) {
        this.supportLayer = supportLayer;
        this.editionLayer = editionLayer;
        this.selection = new Map();
        L.Util.setOptions(this, options);
    },

    onAdd: function(map) {
        this._map = map;

        // this._map.on("moveend", this.saveMapView, this);
        if (window.localStorage.getItem("supportData")) {
            let supportData = this.getDataFromLocalStorage();
            // var myGeoJSON = this.layerFromPoints(supportData);
            this.supportLayer.addData(supportData);
        } else {
            this.disableSessionButton();
        }

        // if (window.localStorage.getItem("mapView")) {
        //     this.loadMapView();
        // }

        var codeTitle = this.options.featCodeTitle;
        var orderTitle = this.options.featOrderTitle;

        // create table container
        var container = L.DomUtil.create("div", "sirha-leaflet-table-container");
        var table = (this.table = L.DomUtil.create("table", "scrollable", container));
        var thead = (this.thead = L.DomUtil.create("thead", "", table));
        var tbody = (this.tbody = L.DomUtil.create("tbody", "", table));

        // header
        var header = "<thead><tr>";
        header += "<th><strong>" + codeTitle + "</strong></th>";
        header += '<th style="display:none;"><strong>' + orderTitle + "</strong></th>";
        header += "</tr></thead>";
        thead.innerHTML = header;

        // fill table with rows, if supportLayer group has any layer
        var control = this;
        this.supportLayer.eachLayer(function(layer) {
            control.doAddRow(table, layer);
        });
        L.DomUtil.setOpacity(this.table, 0.7);

        // set events
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.addListener(this.table, "click", this.selectByRow, this);
        // L.DomEvent.addListener(this.table, "dblclick", this.editByRow, this);
        this.supportLayer.on("click", this.selectByFeature, this);
        // this.supportLayer.on('dblclick', this.editByFeature, this);
        this.supportLayer.on("layeradd", this.addRow, this);
        this.supportLayer.on("layerremove", this.removeRow, this);

        return container;
    },

    onRemove: function(map) {
        // unset events
        L.DomEvent.removeListener(this.table, "click", this.selectByRow, this);
        // L.DomEvent.removeListener(this.table, "dblclick", this.editByRow, this);
        this.supportLayer.off("click", this.selectByFeature, this);
        // this.supportLayer.off('dblclick', this.editByFeature, this);
        this.supportLayer.off("layeradd", this.addRow, this);
        this.supportLayer.off("layerremove", this.removeRow, this);
        // this._map.off("moveend", this.saveMapView);
        this.supportLayer.clearLayers();
    },

    deleteSelected: function() {
        this.selection.forEach(value =>
            this.supportLayer.removeLayer(this.getFID(value))
        );
        this.saveToLocalStorage();
        this.selection.clear();
    },

    selectByRow: function(e) {
        var cell = e.target;
        if (cell.id === (undefined || "")) {
            return;
        }
        // id equals to 'fid-123-celltype'
        var fid = parseInt(cell.id.split("-")[1]);
        var row = cell.parentElement;
        if (L.DomUtil.hasClass(row, "selected")) {
            L.DomUtil.removeClass(row, "selected");
            this.unstyleFeature(fid);
        } else {
            L.DomUtil.addClass(row, "selected");
            this.styleFeature(fid);
        }
    },

    selectByFeature: function(e) {
        var fid = this.getFID(e.layer);

        var unselect = this.options.unselectedFeature;
        var select = this.options.selectedFeature;
        if (e.layer.options.fillColor === select.fillColor) {
            // it is selected
            e.layer.setStyle(unselect);
            this.unstyleRow(fid);
            this.selection.delete(fid);
        } else {
            // it is not selected
            e.layer.setStyle(select);
            this.styleRow(fid);
            this.selection.set(fid, e.layer);
        }
    },

    styleFeature: function(fid) {
        var selection = this.selection;
        var select = this.options.selectedFeature;
        let layer = this.supportLayer.getLayer(fid);
        layer.setStyle(select);
        selection.set(fid, layer);
    },

    unstyleFeature: function(fid) {
        var selection = this.selection;
        var unselect = this.options.unselectedFeature;
        let layer = this.supportLayer.getLayer(fid);
        layer.setStyle(unselect);
        selection.delete(fid);
    },

    styleRow: function(fid) {
        var row = L.DomUtil.get("fid-" + fid);
        L.DomUtil.addClass(row, "selected");
    },

    unstyleRow: function(fid) {
        var row = L.DomUtil.get("fid-" + fid);
        L.DomUtil.removeClass(row, "selected");
    },

    addRow: function(e) {
        this.doAddRow(this.table, e.layer);
    },

    doAddRow: function(table, layer) {
        this.setFID(layer);
        let fid = this.getFID(layer);
        var code = this.options.featCodeProp;
        var order = this.options.featOrderProp;

        var props = layer.feature.properties;
        props[code] = props[code] || Object.values(props).find(el => el);
        // var lastIdxOfDash = props[code].lastIndexOf("-");
        // if (lastIdxOfDash !== -1) {
        //     props[order] = props[code].substring(lastIdxOfDash + 1);
        //     props[code] = props[code].substring(0, lastIdxOfDash);
        // } else {
        //     props[order] = "";
        // }

        // add row
        var newRow = this.tbody.insertRow();
        newRow.setAttribute("id", "fid-" + fid);
        var cellId = newRow.insertCell();
        cellId.setAttribute("id", "fid-" + fid + "-id");
        cellId.appendChild(document.createTextNode(props[code]));
        var cellOrder = newRow.insertCell();
        cellOrder.setAttribute("id", "fid-" + fid + "-order");
        cellOrder.appendChild(document.createTextNode(props[order]));
        cellOrder.style.display = "none";
        this.saveToLocalStorage();
    },

    setFID: function(layer) {
        // var fidProp = this.options.featIdProp;
        // var props = layer.feature.properties;
        // props[fidProp] = layer._leaflet_id;
    },

    getFID: function(layer) {
        // var fidProp = this.options.featIdProp;
        // return layer.feature.properties[fidProp]
        return layer._leaflet_id;
    },

    removeRow: function(e) {
        let fid = this.getFID(e.layer);
        var row = L.DomUtil.get("fid-" + fid);
        this.table.deleteRow(row.rowIndex);
    },

    saveToLocalStorage: function() {
        // var myarray = [];
        // this.supportLayer.eachLayer(function(layer) {
        //     myarray.push({
        //         name: layer.feature.properties.name,
        //         coordinates: layer.feature.geometry.coordinates,
        //     });
        // });

        window.localStorage.removeItem("supportData");
        let data = this.supportLayer.toGeoJSON();
        if (data && data.features && data.features.length) {
            window.localStorage.setItem("supportData", JSON.stringify(data));
            // this.saveMapView();
            this.enableSessionButton();
        } else {
            // this._map.resetView();
            this.disableSessionButton();
        }
    },

    getDataFromLocalStorage: function() {
        var localStorageData = window.localStorage.getItem("supportData");
        var parsed = JSON.parse(localStorageData);
        return parsed;
    },

    endSession: function() {
        this.supportLayer.clearLayers();
        this.disableSessionButton();
        // this._map.resetView();
        window.localStorage.removeItem("supportData");
        // window.localStorage.removeItem("mapView");
    },

    disableSessionButton: function() {
        $("#endSession")
            .parent()
            .parent()
            .addClass("disable");
    },

    enableSessionButton: function() {
        $("#endSession")
            .parent()
            .parent()
            .removeClass("disable");
    },

    zoomSelected: function() {
        let layers = Array.from(this.selection.values());
        FitToBounds.fitToLayers(this._map, layers, 0.04, 16);
    },

    // moveToTop: function() {
    //     // TODO: keep sorting strategy for selected rows
    //     var firstTR = this.tbody.firstChild;
    //     var tbody = this.tbody;
    //     this.selection.forEach(function(value, key) {
    //         var rowToMove = L.DomUtil.get("fid-" + key);
    //         tbody.insertBefore(rowToMove, firstTR);
    //     });
    // },
    //
    // clear: function() {
    //     var control = this;
    //     this.selection.forEach(function(value, key) {
    //         control.unstyleRow(key);
    //         control.unstyleFeature(key); // this would delete selection id
    //     });
    //     // this.editionLayer.clearLayers();
    // },

    // makePolygon: function() {
    //     this.editionLayer.clearLayers();
    //     this.editionLayer.addData(this.getPolygonFromPoints());
    //     return this.editionLayer;
    // },
    //
    // getPolygonFromPoints: function() {
    //     // TODO: allow multipolygons and points
    //     var polygon = {
    //         type: "Feature",
    //         properties: {},
    //         geometry: {
    //             type: "Polygon",
    //             coordinates: [[]],
    //         },
    //     };
    //
    //     var myarray = [];
    //     this.selection.forEach(function(value, key) {
    //         myarray.push(value);
    //     });
    //
    //     if (myarray.length < 3) return polygon;
    //
    //     // if no order field is provided,
    //     // the array would be sorted by the order items were added to it
    //     var order = this.options.featOrderProp;
    //     myarray.sort(function(a, b) {
    //         if (a.properties[order] < b.properties[order]) {
    //             return -1;
    //         } else if (a.properties[order] > b.properties[order]) {
    //             return 1;
    //         }
    //         return 0;
    //     });
    //
    //     var fidProp = this.options.featIdProp;
    //     var codeProp = this.options.featCodeProp;
    //     myarray.forEach(function(feat) {
    //         // this assumes one polygon
    //         polygon.geometry.coordinates[0].push([
    //             feat.geometry.coordinates[0],
    //             feat.geometry.coordinates[1],
    //         ]);
    //         // TODO: save proper code property
    //         // now it takes properties from last point
    //         polygon.properties[codeProp] = feat.properties[codeProp];
    //         polygon.properties[fidProp] = feat.properties[fidProp];
    //     });
    //     return polygon;
    // },

    // saveToAPI: function() {
    //     // TODO: save polygon
    //     // this could be a extensible point for others to choose what to do
    //
    //     this.deleteSelected();
    // },

    // editByRow: function(e) {
    //     var cell = e.target;
    //     if (cell.id === (undefined || "")) {
    //         return;
    //     }
    //
    //     // don't let two popups to be opened simultaneously
    //     if (L.DomUtil.get("editPopup")) {
    //         this.closePopup();
    //     }
    //
    //     var panel =
    //         "<div id='editPopup' class='edit_text_dialog'>" +
    //         "<textarea id='textAreaEditPopup'>" +
    //         e.target.textContent +
    //         "</textarea>" +
    //         "<div>" +
    //         "<button id='cancelEditPopup'>Cancelar</button>" +
    //         // "<span class='left' style='min-width: 10px'> | </span>" +
    //         // "<button class='left' id='saveEditPopup'>Guardar</button>" +
    //         "</div>" +
    //         "</div>";
    //
    //     e.target.innerHTML = panel + e.target.innerHTML;
    //     document.getElementById("textAreaEditPopup").select();
    //
    //     var control = this;
    //     document
    //         .getElementById("textAreaEditPopup")
    //         .addEventListener("keypress", function(event) {
    //             var keycode = event.keyCode ? event.keyCode : event.which;
    //             if (keycode == "13") {
    //                 // ENTER key was pressed
    //                 control.saveValueInRowAndCell(cell.id);
    //             }
    //         });
    //
    //     // document.getElementById("saveEditPopup").addEventListener("click", function( event ) {
    //     //   control.saveValueInRowAndCell(cell.id);
    //     // }, false);
    //
    //     document.getElementById("cancelEditPopup").addEventListener(
    //         "click",
    //         function(event) {
    //             control.closePopup();
    //         },
    //         false
    //     );
    // },
    //
    // closePopup: function() {
    //     L.DomUtil.get("editPopup").remove();
    // },

    // saveValueInRowAndCell: function(cellId) {
    //     var newValue = L.DomUtil.get("textAreaEditPopup").value;
    //
    //     // edit table row value
    //     L.DomUtil.get(cellId).textContent = newValue;
    //
    //     // edit layer property value
    //     var fid = parseInt(cellId.split("-")[1]);
    //     var fidProp = this.options.featIdProp;
    //     var codeProp = this.options.featCodeProp;
    //     this.supportLayer.eachLayer(function(layer) {
    //         if (fid === layer.feature.properties[fidProp]) {
    //             layer.feature.properties[codeProp] = newValue;
    //         }
    //     });
    // },

    // layerFromPoints: function(gpxData) {
    //     var gj = {
    //         type: "FeatureCollection",
    //         features: [],
    //     };
    //
    //     points.forEach(function(point) {
    //         gj.features.push(this.getPoint(point));
    //     }, this);
    //
    //     return gj;
    // },
    //
    // getPoint: function(node) {
    //     return {
    //         type: "Feature",
    //         properties: {name: node.name},
    //         geometry: {
    //             type: "Point",
    //             coordinates: node.coordinates,
    //         },
    //     };
    // },

    // saveMapView: function() {
    //     var position = {
    //         zoom: this._map.getZoom(),
    //         center: this._map.getCenter(),
    //     };
    //
    //     window.localStorage.removeItem("mapView");
    //     window.localStorage.setItem("mapView", JSON.stringify(position));
    // },

    // loadMapView: function() {
    //     if (window.localStorage.getItem("mapView")) {
    //         var mapViewRaw = window.localStorage.getItem("mapView");
    //         var mapView = JSON.parse(mapViewRaw);
    //         this._map.setView(mapView.center, mapView.zoom);
    //     }
    // },
});

L.control.table = function(supportLayer, editionLayer, options) {
    return new L.Control.Table(supportLayer, editionLayer, options);
};
