Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.AddCoordinatesModalView = Backbone.UILib.ModalView.extend({
    render: function() {
        this.org_x_widget = document.getElementById("org_x");
        this.org_y_widget = document.getElementById("org_y");
        this.dest_x_widget = document.getElementById("dest_x");
        this.dest_y_widget = document.getElementById("dest_y");
        this.org_srs_widget = document.getElementById("org_srs");
        this.dest_srs_widget = document.getElementById("dest_srs");
        this.coord_label_widget = document.getElementById("coord_label");

        var center = this.options.map.getCenter();
        this._set_values(
            {dest_x: center.lng, dest_y: center.lat},
            "org",
            "placeholder"
        );
        // this._set_values({dest_x: center.lng, dest_y:center.lat}, 'org', 'value');
        // 40,50799 -12,96680
        // 663568,082135983 8566051,91820535
        var self = this;

        this.marker = null;

        this.set_listeners();

        new Backbone.UILib.SelectView({
            el: this.org_srs_widget,
            collection: this.options.domains.byCategory("crs"),
            addVoidValue: false,
        }).render();

        new Backbone.UILib.SelectView({
            el: this.dest_srs_widget,
            collection: this.options.domains.byCategory("crs"),
            addVoidValue: false,
        }).render();

        this.$(".modal").on("shown.bs.modal", function() {
            document.getElementById("org_x").focus();
        });

        this.$(".modal").on("hidden.bs.modal", function() {
            self.marker && self.options.map.removeLayer(self.marker);
            self._close();
        });

        this.$(".modal").modal("show");
    },

    set_listeners: function() {
        var self = this;

        this.org_x_widget.addEventListener(
            "input",
            this.convert_coordinates.bind(this)
        );
        this.org_y_widget.addEventListener(
            "input",
            this.convert_coordinates.bind(this)
        );
        this.org_srs_widget.addEventListener(
            "change",
            this.convert_coordinates.bind(this)
        );
        this.dest_srs_widget.addEventListener(
            "change",
            this.convert_coordinates.bind(this)
        );

        this.coord_label_widget.addEventListener("keyup", function(e) {
            self.enable_create_button();
            if (!self.marker) {
                return;
            }
            var text_label = e.target.value || "Novo punto";
            var popup = self.marker._popup;
            if (popup && popup._isOpen) {
                popup._contentNode.innerText = text_label;
            } else {
                self.marker.unbindPopup();
                self.marker
                    .bindPopup(text_label, {
                        className: "addcoordinates-popup",
                    })
                    .openPopup();
            }
        });

        // document.getElementById('previous-bounds').addEventListener(
        //     'click', this.goToPreviousBounds.bind(this)
        // );

        document
            .getElementById("zoom_to_point")
            .addEventListener("click", this.zoom_to_point.bind(this));
        document
            .getElementById("create_point")
            .addEventListener("click", this.create_point.bind(this));

        this.$(".remove-field").on("click", function(i, el) {
            $(this)
                .parent()
                .find(".input_coord")
                .val("");
            self.convert_coordinates();
        });
    },

    convert_coordinates: function(event, _params) {
        if (!this.are_valid_coordinates()) {
            this.set_values({dest_x: "", dest_y: ""});
            return;
        }
        var params = _params || this.get_values();
        var self = this;

        $.getJSON(Backbone.SIXHIARA.Config.api_transform_coordinates, params)
            .done(function(data) {
                if (!_params) {
                    self.set_values(data);
                }
                if (data.dest_srs == 4326) {
                    // compares integer and str values
                    self.store_wgs84_and_zoom_and_enable_buttons(data);
                } else {
                    self.convert_to_wgs84();
                }
            })
            .fail(function(model, response, error) {
                var errorText = error.errorThrown;
                if (response.responseJSON) {
                    errorText = response.responseJSON.error;
                }
                self.display_error(errorText);
                self.disable_buttons();
            });
    },

    get_values: function() {
        var params = {
            org_srs: $("#org_srs").val(),
            dest_srs: $("#dest_srs").val(),
            x: parseFloat(this.org_x_widget.value.replace(",", ".")),
            y: parseFloat(this.org_y_widget.value.replace(",", ".")),
        };
        return params;
    },

    _set_values: function(values, widget, property) {
        var dest_x = String(values.dest_x).replace(".", ",");
        var dest_y = String(values.dest_y).replace(".", ",");
        this[widget + "_x_widget"][property] = dest_x;
        this[widget + "_y_widget"][property] = dest_y;
    },

    set_values: function(values) {
        this._set_values(values, "dest", "value");
    },

    convert_to_wgs84: function() {
        var params = this.get_values();
        params.dest_srs = "4326";
        this.convert_coordinates(null, params);
    },

    zoom_to_point: function() {
        var map = this.options.map;
        // this.previousBounds = map.getBounds();
        // document.getElementById('previous-bounds').disabled = false;
        this.marker && this.options.map.removeLayer(this.marker);
        this.marker = L.circleMarker(this.wgs84_stored, {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1.5,
            opacity: 0.4,
            fillOpacity: 0,
        }).addTo(this.options.map);
        this.marker.bindPopup(this.coord_label_widget.value || "Novo punto");
        this.marker.openPopup();
        var zoom = map.getZoom() < 16 ? 16 : map.getZoom();
        map.setView(this.wgs84_stored, zoom);
        this.wgs84_zoomed = L.latLng(this.wgs84_stored);
        this.enable_create_button();
    },

    // goToPreviousBounds:function() {
    //     this.marker && this.options.map.removeLayer(this.marker);
    //     this.options.map.fitBounds(this.previousBounds);
    //     this.previousBounds = null;
    //     document.getElementById('previous-bounds').disabled = true;
    // },

    create_point: function() {
        var label = this.coord_label_widget.value;
        var geoJsonLayer = this.options.geoJsonLayer;
        var geojsonFeatureRaw = this.create_GeoJSON_from_points(
            this.wgs84_stored.lng,
            this.wgs84_stored.lat,
            label
        );
        geoJsonLayer.addData(geojsonFeatureRaw);
        this.marker && this.options.map.removeLayer(this.marker);
        this.reset_fiels();
    },

    are_valid_coordinates: function() {
        this.disable_buttons();
        this.removeError();
        var x = this.org_x_widget.value;
        var y = this.org_y_widget.value;
        var newPoint = [this.get_values().x, this.get_values().y];
        if (!x || !y) {
            return false;
        }
        if (!this.org_x_widget.validity.valid || !this.org_y_widget.validity.valid) {
            return false;
        }
        if (this.is_from_Geog()) {
            if (!this.well_formatted_geog_coordinate(x)) {
                var wrongXGeogFormat =
                    'A Coordenada X não ten o formato correcto. ie: "' +
                    window.SIXHIARA.center[0] +
                    '"';
                this.org_x_widget.setCustomValidity(wrongXGeogFormat);
                this.display_error(wrongXGeogFormat);
                return false;
            }
            if (!this.well_formatted_geog_coordinate(y)) {
                var wrongYGeogFormat =
                    'A Coordenada Y não ten o formato correcto. ie: "' +
                    window.SIXHIARA.center[1] +
                    '"';
                this.org_y_widget.setCustomValidity(wrongYGeogFormat);
                this.display_error(wrongYGeogFormat);
                return false;
            }
            if (!this.are_valid_geog_coordinates(newPoint)) {
                return false;
            }
        }
        if (this.is_from_UTM()) {
            if (!this.well_formatted_utm_coordinate(x)) {
                var wrongXUTMFormat =
                    'A Coordenada X não ten o formato correcto. ie: "1316614,053"';
                this.org_x_widget.setCustomValidity(wrongXUTMFormat);
                this.display_error(wrongXUTMFormat);
                return false;
            }
            if (!this.well_formatted_utm_coordinate(y)) {
                var wrongYUTMFormat =
                    'A Coordenada Y não ten o formato correcto. ie: "8554543,482"';
                this.org_y_widget.setCustomValidity(wrongYUTMFormat);
                this.display_error(wrongYUTMFormat);
                return false;
            }
            if (!this.are_valid_utm_coordinates(newPoint)) {
                return false;
            }
        }

        document.getElementById("zoom_to_point").disabled = false;
        return true;
    },

    well_formatted_geog_coordinate: function(c) {
        var reg = /^-?\d{1,3}([,]\d\d*)?$/g;
        return reg.test(c);
    },

    well_formatted_utm_coordinate: function(c) {
        var reg = /^-?\d{6,7}([,]\d\d*)?$/g;
        return reg.test(c);
    },

    are_valid_geog_coordinates: function(point) {
        if (!formatter().inRange(point[0], -180, 180)) {
            // lng_range
            var wrongLngRange = "A Coordenada X não está entre -180 e 180";
            this.org_x_widget.setCustomValidity(wrongLngRange);
            this.display_error(wrongLngRange);
            return false;
        }
        if (!formatter().inRange(point[1], -90, 90)) {
            // lat_range
            var wrongLatRange = "A Coordenada Y não está entre -90 e 90";
            this.org_x_widget.setCustomValidity(wrongLatRange);
            this.display_error(wrongLatRange);
            return false;
        }
        return true;
    },

    are_valid_utm_coordinates: function(point) {
        var nortEast, southWest;
        if (this.get_org_srs() == "32737") {
            // http://spatialreference.org/ref/epsg/wgs-84-utm-zone-37s/
            var northEast = [166021.4431, 1116915.044];
            var southWest = [833978.5569, 10000000.0];
        }
        if (this.get_org_srs() == "32736") {
            // https://epsg.io/32736
            var northEast = [441867.78, 1116915.04];
            var southWest = [833978.56, 10000000.0];
        }
        if (!formatter().inRange(point[0], northEast[0], southWest[0])) {
            // x_range
            var wrongXRange =
                "A Coordenada X não está entre " + northEast[0] + " e " + southWest[0];
            this.org_x_widget.setCustomValidity(wrongXRange);
            this.display_error(wrongXRange);
            return false;
        }
        if (!formatter().inRange(point[1], northEast[1], southWest[1])) {
            // y_range
            var wrongYRange =
                "A Coordenada Y não está entre " + northEast[1] + " e " + southWest[1];
            this.org_x_widget.setCustomValidity(wrongYRange);
            this.display_error(wrongYRange);
            return false;
        }
        return true;
    },

    get_bbox: function() {
        var southWest = window.SIXHIARA.southWest;
        var northEast = window.SIXHIARA.northEast;
        return L.latLngBounds(southWest, northEast);
    },

    inside_working_area: function(point) {
        var bbox = this.get_bbox();
        return bbox.contains(point);
    },

    create_GeoJSON_from_points: function(x, y, name) {
        return {
            type: "Feature",
            properties: {
                name: name,
            },
            geometry: {
                type: "Point",
                coordinates: [x, y],
            },
        };
    },

    update_select_CRS: function(crs) {
        this.org_srs_widget.selectedIndex = 0;
        for (var i = 0; i < org_srs.length; i++) {
            if (this.org_srs_widget.options[i].value == crs) {
                this.org_srs_widget.options[i].selected = true;
            }
        }
    },

    display_error: function(errorMessage, color) {
        var helpBlock = document.getElementById("helpBlock_coordinates");
        helpBlock.innerHTML = errorMessage;
        helpBlock.style.color = color || "red";
        helpBlock.classList.remove("non-visible");

        // var timeout = null;
        // clearTimeout(timeout);
        // timeout = setTimeout(function() {
        //     helpBlock.classList.add('non-visible');
        // }, 5000);
    },

    removeError: function() {
        this.org_x_widget.setCustomValidity("");
        this.org_y_widget.setCustomValidity("");
        var helpBlock = document.getElementById("helpBlock_coordinates");
        helpBlock.innerHTML = "";
        helpBlock.classList.add("non-visible");
    },

    is_new_label: function(label) {
        var layers = this.get_map_layers();
        var self = this;

        return Object.keys(layers).every(function(key) {
            if (self.isGPSPoint(layers[key])) {
                return layers[key].feature.properties.name != label;
            }
            return true;
        });
    },

    isGPSPoint: function(layer) {
        return layer.hasOwnProperty("_latlng") && layer.hasOwnProperty("feature");
    },

    get_map_layers: function() {
        return this.options.map._layers;
    },

    reset_fiels: function() {
        this.org_x_widget.value = "";
        this.org_y_widget.value = "";
        this.dest_x_widget.value = "";
        this.dest_y_widget.value = "";
        this.coord_label_widget.value = "";
        this.org_srs_widget.selectedIndex = 0;
        this.dest_srs_widget.selectedIndex = 0;
        this.wgs84_stored = null;
        this.wgs84_zoomed = null;
        this.disable_buttons();
    },

    is_wgs84_selected_in_any_combo: function() {
        return this.get_org_srs() === "4326" || this.get_dest_srs() === "4326";
    },

    get_org_srs: function() {
        return this.org_srs_widget.options[this.org_srs_widget.selectedIndex].value;
    },

    get_dest_srs: function() {
        return this.dest_srs_widget.options[this.dest_srs_widget.selectedIndex].value;
    },

    is_from_Geog: function() {
        return this.get_org_srs() == "4326";
    },

    is_to_EPSG_4326: function() {
        return this.get_dest_srs() == "4326";
    },

    is_from_UTM: function() {
        return this.get_org_srs() == "32737" || this.get_org_srs() == "32736";
    },

    store_wgs84_and_zoom_and_enable_buttons: function(data) {
        var newPoint = L.latLng(data.dest_y, data.dest_x);
        this.wgs84_stored = newPoint;
        // only change the position when there is about a 5m change.
        // var tolerance = this.is_from_Geog() ? 0.000005 : 5;
        // if (!this.wgs84_stored || !this.wgs84_stored.equals(newPoint, tolerance)) {
        //     this.wgs84_stored = newPoint;
        //     this.zoom_to_point();
        // }
        document.getElementById("zoom_to_point").disabled = false;
    },

    enable_create_button: function() {
        if (!this.are_valid_coordinates()) {
            return false;
        }

        this.coord_label_widget.setCustomValidity("");
        if (!this.inside_working_area(this.wgs84_stored)) {
            var outOfBBox =
                "O ponto que você acrescentou está situado fora do ámbito de actuación.";
            this.display_error(outOfBBox, "#8a6d3b");
            return false;
        }

        var label = this.coord_label_widget.value;
        if (!label) {
            var mandatoryLabel = "É necessário por um código para poder criar o ponto.";
            this.coord_label_widget.setCustomValidity(mandatoryLabel);
            this.display_error(mandatoryLabel, "#8a6d3b");
            return false;
        }

        if (!this.is_new_label(label)) {
            var notNewLabel = "Já existe um ponto com o mesmo código.";
            this.coord_label_widget.setCustomValidity(notNewLabel);
            this.display_error(notNewLabel, "#8a6d3b");
            return false;
        }

        var tolerance = this.is_from_Geog() ? 0.000005 : 5;
        if (!this.wgs84_stored.equals(this.wgs84_zoomed, tolerance)) {
            var notZoomed = "Deve fazer zoom o ponto antes de o poder criar";
            this.display_error(notZoomed, "#8a6d3b");
            return false;
        }

        document.getElementById("create_point").disabled = false;
        return true;
    },

    disable_buttons: function() {
        document.getElementById("create_point").disabled = true;
        document.getElementById("zoom_to_point").disabled = true;
    },
});
