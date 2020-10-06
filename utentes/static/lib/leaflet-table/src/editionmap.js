if (Backbone.SIXHIARA.EditionMap) {
    throw new Error("Backbone.SIXHIARA.EditionMap ya está definido");
}

Backbone.SIXHIARA.EditionMap = function(map) {
    // TODO: take it from leaflet-table
    var unselectedFeature = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 0.4,
        fillOpacity: 0.4,
    };

    function popup(feature, layer) {
        var popupoptions = {
            minWidth: 275,
            maxWidth: 500,
        };

        if (!feature || !feature.properties) {
            return;
        }

        var popupContent =
            '<table class="table-condensed">' +
            Object.entries(feature.properties)
                .map(e => `<tr><td><strong>${e[0]}</strong></td><td>${e[1]}</td></tr>`)
                .join() +
            "</table>";
        layer.bindPopup(popupContent, popupoptions);
    }

    var supportLayer = L.geoJson([], {
        pointToLayer: function(feature, latlng) {
            let layer = L.circleMarker(latlng, unselectedFeature);
            popup(feature, layer);
            return layer;
        },
        onEachFeature: popup,
    });

    var geometryEdited = false;
    // var editionLayer = new L.FeatureGroup();
    var editionLayer = L.geoJson(undefined, {
        style: {
            stroke: true,
            color: "#ff0000",
            weight: 4,
            opacity: 0.5,
            fillColor: "#ff0000",
            fillOpacity: 0.2,
        },
        pmIgnore: false,
    });

    var table = L.control.table(supportLayer, editionLayer, {featOrderTitle: "Ordem"});

    var supportLayerToolbar = new L.Toolbar2.Control({
        position: "topright",
        actions: [ImportGPX, ZoomSelected, DeleteSelected, AddCoordinates, EndSession],
        className: "support-layer-toolbar",
    });

    function disableToolbar(name) {
        var toolbarNode = document.getElementsByClassName(name)[0];
        toolbarNode.style.pointerEvents = "none";
        var btNodes = toolbarNode.querySelectorAll("a");
        btNodes.forEach(a => a.classList.add("leaflet-disabled"));
    }

    function enableToolbar(name) {
        var toolbarNode = document.getElementsByClassName(name)[0];
        toolbarNode.style.pointerEvents = "auto";
        var btNodes = toolbarNode.querySelectorAll("a");
        btNodes.forEach(a => a.classList.remove("leaflet-disabled"));
    }

    function toggleToCreationMode() {
        map.pm.disableGlobalRemovalMode();
        enableToolbar("leaflet-pm-draw");
        disableToolbar("leaflet-pm-edit");
    }

    function toggleToEditionMode() {
        // map.pm.enableGlobalRemovalMode();
        disableToolbar("leaflet-pm-draw");
        enableToolbar("leaflet-pm-edit");
    }

    var _model = undefined;
    function beginEdition(e, model) {
        stopEditionToolbar.addTo(map);
        var drawNodes = document.querySelectorAll("td.draw");
        drawNodes.forEach(a => a.classList.add("disabled"));

        _model = model;

        supportLayerToolbar.addTo(map, supportLayer, table);
        table.addTo(map);
        supportLayer.addTo(map);
        editionLayer.clearLayers();
        editionLayer.addTo(map);

        map.pm.addControls({
            position: "topleft",
            drawMarker: false,
            drawCircleMarker: false,
            drawPolyline: false,
            drawRectangle: false,
            drawPolygon: true,
            drawCircle: false,
            editMode: true,
            dragMode: false,
            cutPolygon: false,
            removalMode: true,
            pinningOption: false,
            snappingOption: false,
        });

        _model.leafletLayer && _model.leafletLayer.remove();
        _model.leafletLayerLabel && _model.leafletLayerLabel.remove();

        geometryEdited = false;

        if (model.hasGeometry()) {
            var data = model.toGeoJSON();
            editionLayer.addData(data);
            toggleToEditionMode();
        } else {
            toggleToCreationMode();
        }
        FitToBounds.fitToLayers(map, editionLayer, 0.1, 16);

        map.on("pm:create", function(e) {
            e.layer.remove();
            editionLayer.clearLayers();
            editionLayer.addData(e.layer.toGeoJSON());
            toggleToEditionMode();
            geometryEdited = true;
        });

        map.on("pm:remove", function(e) {
            toggleToCreationMode();
            editionLayer.clearLayers();
            geometryEdited = true;
        });

        editionLayer.on("pm:edit", function(e) {
            // editionLayer.clearLayers();
            // editionLayer.addLayer(e.layer);
            geometryEdited = true;
        });

        map.isFullscreen() || map.toggleFullscreen({pseudoFullscreen: true});
        window.vent.trigger("sirha:editionmap:editionbegined");
    }

    function updateModelGeometry(model, geometry) {
        // Hay un par de funciones de Leaflet que deberían evitar
        // boilerplate aquí tipo asFeature
        // usa distintos sistemas de tratar de obtener la "geometry" a partir de un
        // parámetro de entrada que podría ser una Feature, una Geometry, una Layer, ...
        if (geometry.toGeoJSON) {
            geometry = geometry.toGeoJSON();
        }

        if (geometry.features && geometry.features.length) {
            var feat =
                geometry.features && geometry.features.length && geometry.features[0];
            geometry = feat.geometry;
        }

        if (geometry.coordinates && geometry.coordinates.length) {
            model.get("geometry").set(
                {
                    type: geometry.type,
                    coordinates: geometry.coordinates,
                },
                {silent: true}
            );
        } else {
            model.set("geometry", {silent: true});
        }

        model.set("geometry_edited", true);

        if (!model.isValid()) {
            bootbox.alert("Erro validando o modelo. " + model.validationError);
            return;
        }

        model.save(null, {
            wait: true,
            success: function() {
                // self.table.deleteSelected();
                // self.table.clear();
                window.location.reload();
            },
            error: function(xhr, textStatus) {
                bootbox.alert(textStatus.statusText + " " + textStatus.responseText);
            },
        });
    }

    function stopEdition() {
        if (geometryEdited) {
            updateModelGeometry(_model, editionLayer);
        }
        cancelEdition();
    }

    function cancelEdition() {
        // e, model
        map.off("pm:create");
        map.off("pm:remove");
        map.off("pm:edit");

        supportLayer.remove();
        editionLayer.clearLayers();
        editionLayer.remove();
        supportLayerToolbar.remove();
        table.remove();
        map.pm.removeControls();
        map.isFullscreen() && map.toggleFullscreen({pseudoFullscreen: true});

        var drawNodes = document.querySelectorAll("td.draw");
        drawNodes.forEach(a => a.classList.remove("disabled"));

        // table.clear();

        stopEditionToolbar.remove();
        _model.leafletLayer && _model.leafletLayer.addTo(map);
        _model.leafletLayerLabel && _model.leafletLayerLabel.addTo(map);
        _model = undefined;
        window.vent.trigger("sirha:editionmap:editionfinished");
    }
    window.vent.on("sirha:editionmap:beginedition", beginEdition);
    window.vent.on("sirha:editionmap:stopedition", stopEdition);
    window.vent.on("sirha:editionmap:canceledition", cancelEdition);

    var stopEditionToolbar = new L.Toolbar2.Control({
        position: "topleft",
        actions: [window.CancelEdition, window.EndEdition],
        className: "stop-edition-toolbar",
    });

    map.on("fullscreenchange", function() {
        let main = document.getElementsByTagName("main")[0];
        let menu = document.getElementsByTagName("menu")[0];
        let mapNode = document.getElementById("map");
        let mapSection = document.getElementById("map-section");
        if (map.isFullscreen()) {
            main.style.display = "none";
            menu.style.display = "none";
            mapNode.remove();
            document.body.prepend(mapNode);
        } else {
            main.style.display = "block";
            menu.style.display = "block";
            mapNode.remove();
            mapSection.prepend(mapNode);
            map.invalidateSize();
        }
    });
};
