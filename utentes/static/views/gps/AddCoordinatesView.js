Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.AddCoordinatesView = Backbone.UILib.ModalView.extend({

    ERROR: {
        notNewLabel    : 'Já existe um ponto com o mesmo código.',
        mandatory_label: 'É necessário por um código para poder criar o ponto.',
        outOfBBox      : 'O ponto que você acrescentou está situado fora de Moçambique.',
        wrongXYFormat  : 'As coordenadas não são introduzidos no formato correcto ou a projeção geográfica não é adequada.',
        noWGS84        : 'Para criar um ponto, uma das duas formulários deve estar em WGS84 / EPSG:4326.',
        automaticUTM   : 'As coordenadas que você digitou parecem do tipo UTM. <br>O <strong>UTM 37S / EPSG: 32737</strong> foi selecionado automaticamente, é o correto?.',
        automaticWGS84 : 'As coordenadas que você inseriu parecem ser de um tipo geográfico (lat long). <br>O <strong>WGS84 / EPSG:4326</strong> foi selecionado automaticamente.'
    },

    render: function(){
        var self = this;

        var markers = L.layerGroup().addTo(this.options.map);
        this.markers = markers;

        this.set_listeners();

        new Backbone.UILib.SelectView({
            el: this.$('#org_srs'),
            collection: this.options.crss
        }).render();

        new Backbone.UILib.SelectView({
            el: this.$('#dest_srs'),
            collection: this.options.crss
        }).render();

        this.converted_coor = {
            wgs84: {
                org_srs: null,
                x: null,
                y: null
            }
        };

        this.$('.modal').modal('show');
        this.$('.remove-field').on('click', function(i, el){
            $(this).parent().find('.input_coord').val('');
        });
    },

    converto_to_wgs84: function(x, y){
        var self = this;
        var org_srs = $('#org_srs').val();
        var params = $.param({
            'org_srs': org_srs,
            'dest_srs': '4326',
            'x': x,
            'y': y
        });
        var transformer = new Backbone.SIXHIARA.TransformCoordinatesModel();

        transformer.fetch({
            parse: true,
            data: params,
            success: function(model) {
                var x = model.get('dest_x');
                var y = model.get('dest_y');
                self.store_wgs84(x, y, org_srs);
                self.zoom_to_point(x, y);
                self.enable_buttons();

            },
            error: function(model, response, error) {
                var errorText = error.errorThrown;
                if(response.responseJSON) {
                    errorText = response.responseJSON.error;
                }
                self.display_error(errorText);
            }
        });
    },

    convert_coordinates: function(x, y, not_zoom){
        var self = this;
        var org_srs = $('#org_srs').val();
        var dest_srs = $('#dest_srs').val();
        var org_x = $('#org_x').val();
        var org_y = $('#org_y').val();
        var dest_x = $('#dest_x').val();
        var dest_y = $('#dest_y').val();
        var params = $.param({
            'org_srs': org_srs,
            'dest_srs': dest_srs,
            'x': org_x,
            'y': org_y
        });
        var transformer = new Backbone.SIXHIARA.TransformCoordinatesModel();

        transformer.fetch({
            parse: true,
            data: params,
            success: function(model) {
                var x = model.get('dest_x');
                var y = model.get('dest_y');
                $('#dest_x').val(x);
                $('#dest_y').val(y);
                $('#dest_srs').val(model.get('dest_srs'));
                if (self.is_wgs84_selected_in_any_combo()) {
                    self.store_wgs84(x, y, org_srs);
                    if(!not_zoom){
                        self.zoom_to_point(x, y);
                    }
                }else {
                    self.converto_to_wgs84(org_x, org_y, '4326');
                }

            },
            error: function(model, response, error) {
                var errorText = error.errorThrown;
                if(response.responseJSON) {
                    errorText = response.responseJSON.error;
                }
                self.display_error(errorText);
            }
        });
    },

    zoom_to_point: function(lat, lng){
        if (!this.validate_geographic_coordinates(lat, lng) ) {
            var lng_lat = this.get_wgs_conversion();
            lat = lng_lat[0];
            lng = lng_lat[1];
        }

        var map = this.options.map;

        this.markers.clearLayers();
        var newMarker = L.marker([lng, lat])
            .addTo(this.markers);

        newMarker
            .bindPopup($('#coord_label').val() || 'Novo punto')
            .openPopup();

        map.setView([lng, lat], 12);
    },

    create_point: function(lat, lng, converted){
        if (!this.validate_geographic_coordinates(lat, lng) ) {
            var lng_lat = this.get_wgs_conversion();
            lat = lng_lat[0];
            lng = lng_lat[1];
        }

        if (!this.geo_contains(L.point(lng, lat))) {
            this.display_error(this.ERROR.outOfBBox);
            return;
        }

        var label = $('#coord_label').val();
        if(!label){
            this.display_error(this.ERROR.mandatory_label);
            return;
        }

        if(!this.is_new_label(label)) {
            this.display_error(this.ERROR.notNewLabel);
            return;
        }

        var geoJsonLayer = this.options.geoJsonLayer;
        var geojsonFeatureRaw = this.create_GeoJSON_from_points(lat, lng, label);
        geoJsonLayer.addData(geojsonFeatureRaw);
        this.markers.clearLayers();
        this.reset_fiels();
        this.disable_buttons();
    },

    validate_geographic_coordinates: function(x, y){
        var val_x = parseFloat(x);
        var val_y = parseFloat(y);
        if (isNaN(val_x) || val_x >= 90 || val_x <= -90){
            return false;
        }
        if (isNaN(val_y) || val_y >= 90 || val_y <= -90){
            return false;
        }
        return true;
    },

    validate_UTM_coordinates: function(x, y){
        // TODO: Find a better way
        var reg = /^-?\d{4,}.\.\d{1,}/m;
        return reg.test(x) && reg.test(y);
    },

    detect_coordinates: function(x, y){
        if (this.validate_geographic_coordinates(x, y)) {
            if(!this.is_from_EPSG_4326()){
                this.display_error(this.ERROR.automaticWGS84, 'green');
            }
            this.update_select_CRS('4326');

        }else if(this.validate_UTM_coordinates(x, y) && this.is_from_EPSG_4326()){
            this.update_select_CRS('32737');
            this.display_error(this.ERROR.automaticUTM, 'green');
        }
        // TODO: Improve detection to find differences between EPSG:32736 and EPSG:32737 if it is possible
    },

    well_formatted_coordinates: function(x, y){
        var reg = /^-?\d{1,}.\d{1,}$/m;
        return reg.test(x) && reg.test(y);
    },

    are_valid_coordinates: function(x, y){
        this.enable_buttons();

        if (this.well_formatted_coordinates(x, y)) {
            this.detect_coordinates(org_x.value, org_y.value);
            if (this.is_from_EPSG_4326() && this.validate_geographic_coordinates(x, y)) {
                return true;
            }else if (this.is_from_EPSG_32736() && this.validate_UTM_coordinates(x, y)) {
                return true;
            }else if (this.is_from_EPSG_32737() && this.validate_UTM_coordinates(x, y)) {
                return true;
            }else if (!this.is_wgs84_selected_in_any_combo()) {
                var lng_lat = this.get_wgs_conversion();
                if (this.validate_geographic_coordinates(lng_lat[0], lng_lat[1])) {
                    return true;
                }
            }
        }
        this.disable_buttons();
        this.display_error(this.ERROR.wrongXYFormat);
        return false;
    },

    create_GeoJSON_from_points: function(x, y, name){
        return {
            'type': 'Feature',
            'properties': {
                'name': name
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [x, y]
            }
        };
    },

    get_bbox: function(){
        var southWest = L.point([-26.99, 30.18]);
        var northEast = L.point([-10.32, 40.89]);
        return L.bounds(southWest, northEast);
    },

    geo_contains: function(point){
        var bbox = this.get_bbox();
        return bbox.contains(point);
    },

    update_select_CRS: function(crs){
        var org_srs = document.getElementById('org_srs');
        org_srs.selectedIndex = 0;
        for (var i = 0; i < org_srs.length; i++) {
            if(org_srs.options[i].value == crs){
                org_srs.options[i].selected = true;
            }
        }
    },

    display_error: function(errorMessage, color){
        var helpBlock = document.getElementById('helpBlock_coordinates');
        helpBlock.innerHTML = errorMessage;
        helpBlock.style.color = color || 'red';
        helpBlock.classList.remove('non-visible');

        var timeout = null;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            helpBlock.classList.add('non-visible');
        }, 5000);
    },

    is_new_label: function(label){
        var layers = this.get_map_layers();
        var self = this;

        return Object.keys(layers).every(function(key){
            if (self.isGPSPoint(layers[key])) {
                return layers[key].feature.properties.name != label;
            }
            return true;
        });

    },

    isGPSPoint: function(layer){
        return layer.hasOwnProperty('_latlng') && layer.hasOwnProperty('feature');
    },

    get_map_layers: function(){
        return this.options.map._layers;
    },

    reset_fiels: function(){
        document.getElementById('org_x').value = '';
        document.getElementById('org_y').value = '';
        document.getElementById('dest_x').value = '';
        document.getElementById('dest_y').value = '';
        document.getElementById('coord_label').value = '';
        document.getElementById('org_srs').selectedIndex = 0;
        document.getElementById('dest_srs').selectedIndex = 0;
    },

    set_listeners: function(){
        var self = this;
        var org_x = document.getElementById('org_x');
        var org_y = document.getElementById('org_y');
        var dest_x = document.getElementById('dest_x');
        var dest_y = document.getElementById('dest_y');
        var org_srs = document.getElementById('org_srs');
        var dest_srs = document.getElementById('dest_srs');

        var coord_label = document.getElementById('coord_label');
        var zoom_to_point = document.getElementById('zoom_to_point');
        var create_point = document.getElementById('create_point');

        org_x.addEventListener('input', function(e){
            if(org_x.value && org_y.value && self.are_valid_coordinates(org_x.value, org_y.value)){
                self.convert_coordinates(org_x.value, org_y.value);
            }
        });

        org_y.addEventListener('input', function(e){
            if(org_x.value && org_y.value && self.are_valid_coordinates(org_x.value, org_y.value)){
                self.convert_coordinates(org_x.value, org_y.value);
            }
        });

        var timeout = null;
        coord_label.addEventListener('keyup', function(e){
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                if (Object.keys(self.markers.getLayers())) {
                    self.markers.eachLayer(function(marker){
                        var popup = marker.getPopup();
                        if (popup && popup._isOpen) {
                            popup.setContent(e.target.value);
                        }else {
                            marker
                                .bindPopup(e.target.value)
                                .openPopup();
                        }
                        if (e.target.value == '') {
                            marker.closePopup();
                        }
                    });
                };
            }, 500);
        });

        // Zoom
        zoom_to_point.addEventListener('click', function(e){
            if(org_x.value && org_y.value && self.are_valid_coordinates(org_x.value, org_y.value)){
                self.zoom_to_point(org_x.value, org_y.value);
            }
        });
        // Create point
        create_point.addEventListener('click', function(e){
            if(org_x.value && org_y.value && self.are_valid_coordinates(org_x.value, org_y.value)){
                self.create_point(org_x.value, org_y.value);
            }
        });

        // Change CRS's combo
        org_srs.addEventListener('change', function(e){
            if(org_x.value && org_y.value && self.are_valid_coordinates(org_x.value, org_y.value)){
                self.check_if_last_wgs84_was_from_same_crs();
            }
        });

        dest_srs.addEventListener('change', function(e){
            if(org_x.value && org_y.value && self.are_valid_coordinates(org_x.value, org_y.value)){
                var not_zoom = true;
                self.convert_coordinates(org_x.value, org_y.value, not_zoom);
            }
        });
    },

    check_if_last_wgs84_was_from_same_crs: function(){
        var wgs_conversion_stored = this.get_wgs_conversion(true);
        if (wgs_conversion_stored.org_srs!= org_srs.options[org_srs.selectedIndex].value) {
            this.convert_coordinates(org_x.value, org_y.value);
            var wgs_conversion_stored = this.get_wgs_conversion(true);
            var lng = wgs_conversion_stored.lat[0];
            var lat = wgs_conversion_stored.lat[1];
            if(lng && lat){
                this.zoom_to_point(lng, lat);
            }
        }else{
            var lng = wgs_conversion_stored.lat[0];
            var lat = wgs_conversion_stored.lat[1];
            if(lng && lat){
                this.zoom_to_point(lng, lat);
            }
        }
    },

    is_wgs84_selected_in_any_combo: function(){
        var org_srs = document.getElementById('org_srs');
        var dest_srs = document.getElementById('dest_srs');
        return org_srs.options[org_srs.selectedIndex].value == '4326' ||
               dest_srs.options[dest_srs.selectedIndex].value == '4326';
    },

    get_org_srs: function(){
        var org_srs = document.getElementById('org_srs');
        return org_srs.options[org_srs.selectedIndex].value;
    },

    get_dest_srs: function(){
        var dest_srs = document.getElementById('dest_srs');
        return dest_srs.options[dest_srs.selectedIndex].value;
    },

    is_from_EPSG_4326: function(){
        return this.get_org_srs() == '4326';
    },

    is_to_EPSG_4326: function(){
        return this.get_dest_srs() == '4326';
    },

    is_from_EPSG_32737: function(){
        return this.get_org_srs() == '32737';
    },

    is_from_EPSG_32736: function(){
        return this.get_org_srs() == '32736';
    },

    store_wgs84: function(x, y, org_srs){
        this.converted_coor.wgs84.org_srs = org_srs;
        this.converted_coor.wgs84.x = parseFloat(x);
        this.converted_coor.wgs84.y = parseFloat(y);
    },

    get_wgs_conversion: function(with_crs){
        if (!with_crs) {
            return [this.converted_coor.wgs84.x,
                this.converted_coor.wgs84.y];
        }
        return {
            lat: this.converted_coor.wgs84.x,
            lng: this.converted_coor.wgs84.y,
            org_srs: this.converted_coor.wgs84.org_srs
        };
    },

    disable_buttons: function(){
        this.$('#create_point').prop('disabled', true);
        this.$('#zoom_to_point').prop('disabled', true);
    },

    enable_buttons: function(){
        this.$('#create_point').prop('disabled', false);
        this.$('#zoom_to_point').prop('disabled', false);
    },
});
