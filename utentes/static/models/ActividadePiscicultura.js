Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadePiscicultura = Backbone.SIXHIARA.ActividadeNull.extend({
    defaults: {
        id: null,
        tipo: "Piscicultura",
        c_estimado: null,
        area: null,
        ano_i_ati: null,
        tipo_aqua: null,
        esp_culti: null,
        n_tanques: null,
        v_reservas: null,
        prov_alev: null,
        n_ale_pov: null,
        produc_pi: null,
        tipo_proc: null,
        asis_aber: null,
        asis_moni: null,
        asis_orig: null,
        asis_or_o: null,
        trat_t_en: null,
        trat_a_sa: null,
        gaio_subm: null,
        problemas: null,
        prob_prin: null,
        tanques_piscicolas: new Backbone.SIXHIARA.TanquePiscicolaCollection(),
    },

    initialize: function() {
        this.get("tanques_piscicolas").on(
            "all",
            this.updateChildBasedComputations,
            this
        );
    },

    parse: function(response) {
        response.tanques_piscicolas = new Backbone.SIXHIARA.TanquePiscicolaCollection(
            response.tanques_piscicolas,
            {parse: true}
        );
        return response;
    },

    updateChildBasedComputations: function() {
        var n_tanques = 0;
        var v_reservas = 0;
        var n_ale_pov = 0;
        var produc_pi = 0;
        this.get("tanques_piscicolas").forEach(function(child) {
            n_tanques += 1;
            v_reservas += child.get("volume");
            n_ale_pov += child.get("n_ale_pov");
            produc_pi += child.get("pro_anual");
        });
        this.set("n_tanques", n_tanques);
        this.set("v_reservas", v_reservas);
        this.set("n_ale_pov", n_ale_pov);
        this.set("produc_pi", produc_pi);
        this.trigger("change", this.model);
    },

    toJSON: function() {
        var json = _.clone(this.attributes);
        json.tanques_piscicolas = this.get("tanques_piscicolas").toJSON();
        return json;
    },

    getActividadeLayer: function(map) {
        var tanques_piscicolas = this.get("tanques_piscicolas");
        if (!tanques_piscicolas) return null;
        var geojson = tanques_piscicolas.toGeoJSON();
        if (geojson.features.length == 0) return null;
        return L.geoJson(geojson, {
            onEachFeature: function(feature, layer) {
                var label = L.marker(layer.getBounds().getCenter(), {
                    icon: L.divIcon({
                        className: "leaflet-div-icon-actividade-label",
                        html: SIRHA.Services.IdService.extractSeqFromChildId(
                            feature.properties.tanque_id
                        ),
                    }),
                }).addTo(map);
            },
            style: this.setStyleFeature,
        });
    },

    setStyleFeature: function(feature) {
        if (feature.properties.tipo === "Tanque") {
            return {
                stroke: true,
                color: "#436eee",
                weight: 1,
                opacity: 1,
                fillColor: "#436eee",
                fillOpacity: 0.5,
            };
        } else if (feature.properties.tipo === "Gaiola") {
            return {
                stroke: true,
                color: "#1a2c5f",
                weight: 1,
                opacity: 1,
                fillColor: "#1a2c5f",
                fillOpacity: 0.5,
            };
        }
    },

    validateSubActivity: function() {
        var messages = [];
        this.get("tanques_piscicolas").forEach(function(tanque) {
            var msgs = tanque.validate();
            if (msgs) {
                messages = messages.concat(msgs);
            }
        });
        return messages;
    },
});

// declare activity for dinamic discovery
Backbone.SIXHIARA.ActividadesFactory = Backbone.SIXHIARA.ActividadesFactory || {};
Backbone.SIXHIARA.ActividadesFactory["Piscicultura"] =
    Backbone.SIXHIARA.ActividadePiscicultura;
