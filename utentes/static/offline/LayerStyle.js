Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.LayerStyle = {
    doPointToLayerEstacoes: function(feature, latlng) {
        return L.marker(
            latlng,
            Backbone.SIXHIARA.LayerStyle.doStyleEstacoes(feature)
        ).bindTooltip(feature.properties.cod_estac, {
            permanent: true,
            offset: [2, -26],
            className: "sixhiara-leaflet-label-estacoes",
            opacity: 1,
            zoomAnimation: true,
            interactive: false,
            direction: "auto",
            sticky: false,
        });
    },
    doStyleEstacoes: function(feature) {
        var tip_estac = feature.properties.tip_estac;
        switch (tip_estac) {
            case "Hidrométrica":
                return {
                    icon: Backbone.SIXHIARA.LayerStyle.hidroIcon,
                    interactive: false,
                };
                break;
            case "Pluviométrica":
                return {
                    icon: Backbone.SIXHIARA.LayerStyle.pluvioIcon,
                    interactive: false,
                };
                break;
        }
    },
    hidroIcon: L.icon({
        iconUrl: "/static/offline/legend/Hidrometrica.png",
        iconSize: [20.0, 20.0],
    }),
    pluvioIcon: L.icon({
        iconUrl: "/static/offline/legend/Pluviometrica.png",
        iconSize: [20.0, 20.0],
    }),

    doPointToLayerBarragens: function(feature, latlng) {
        return L.marker(latlng, Backbone.SIXHIARA.LayerStyle.doStyleBarragens(feature));
    },
    doStyleBarragens: function(feature) {
        var tip_barra = feature.properties.tip_barra;
        switch (tip_barra) {
            case "Barragem":
                return {
                    icon: Backbone.SIXHIARA.LayerStyle.barragemIcon,
                    interactive: false,
                };
                break;
            case "Represa":
                return {
                    icon: Backbone.SIXHIARA.LayerStyle.represaIcon,
                    interactive: false,
                };
                break;
        }
    },
    barragemIcon: L.icon({
        iconUrl: "/static/offline/legend/Barragem.png",
        iconSize: [20.0, 20.0],
    }),
    represaIcon: L.icon({
        iconUrl: "/static/offline/legend/Represa.png",
        iconSize: [20.0, 20.0],
    }),

    doPointToLayerFontes: function(feature, latlng) {
        let commonStyle = {
            weight: 0,
            opacity: 0,
            fillOpacity: 1.0,
            interactive: false,
        };
        let customStyle = Backbone.SIXHIARA.LayerStyle.doStyleFontesCustom(feature);

        return L.circleMarker(latlng, Object.assign({}, customStyle, commonStyle));
    },

    doStyleFontesCustom: function doStyleFontesCustom(feature) {
        switch (feature.properties.red_monit) {
            case "Velho-Sustituído":
                return {
                    radius: 3,
                    fillColor: "#1f78b4",
                    color: "#1f78b4",
                };
            case "Base e qualidade":
                return {
                    radius: 6,
                    fillColor: "#a51215",
                    color: "#a51215",
                };
            case "Base":
                return {
                    radius: 6,
                    fillColor: "#4c9322",
                    color: "#4c9322",
                };
            case "NO":
            default:
                return {
                    radius: 3,
                    fillColor: "#1f78b4",
                    color: "#1f78b4",
                };
        }
    },

    marker_EntidadesPopulacao: new L.icon({
        iconUrl: "/static/offline/legend/EntidadesPopulacao.png",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    }),
    doPointToLayerEntidadespopulacao: function(feature, latlng) {
        return L.marker(latlng, {
            icon: Backbone.SIXHIARA.LayerStyle.marker_EntidadesPopulacao,
            interactive: false,
        }).bindTooltip(feature.properties.nome, {
            permanent: true,
            offset: [-0, -16],
            className: "sixhiara-leaflet-label-entidadespopulacao",
            opacity: 1,
            zoomAnimation: true,
            interactive: false,
            direction: "auto",
            sticky: false,
        });
    },

    doStylealbufeiras: function(feature) {
        return {
            weight: 0.52,
            color: "#304b8a",
            fillColor: "#304b8a",
            opacity: 1.0,
            fillOpacity: 1.0,
            interactive: false,
        };
    },

    doStylelagos: function(feature) {
        return {
            weight: 0.52,
            color: "#00537d",
            fillColor: "#00537d",
            opacity: 1.0,
            fillOpacity: 1.0,
            interactive: false,
        };
    },

    doStyleestradas: function(feature) {
        switch (feature.properties.tipo) {
            case "Primária":
                return {
                    color: "#770514",
                    weight: 1.6,
                    opacity: "1.0",
                    interactive: false,
                    fillColor: "#fff",
                    interactive: false,
                };
            case "Secundária":
                return {
                    color: "#11370f",
                    weight: 1,
                    opacity: "0.8",
                    interactive: false,
                };
            case "Vicinhal":
                return {
                    color: "#5f4b0f",
                    weight: 0.5,
                    opacity: "1.0",
                    interactive: false,
                };
        }
    },

    doStylerios: function(feature) {
        return {
            weight: 0.6,
            color: "#6598da",
            opacity: 1.0,
            interactive: false,
        };
    },

    doStylearas: function(feature) {
        return {
            weight: 1,
            color: "#05328c",
            opacity: 1.0,
            fillOpacity: 0,
            interactive: false,
        };
    },
    onEachFeaturearas: function(feature, layer) {
        let options = {
            permanent: false,
            offset: [0, 0],
            className: "sixhiara-leaflet-label sixhiara-leaflet-label-aras",
            opacity: 1,
            zoomAnimation: true,
            interactive: false,
            direction: "center", // auto, rigth, left, center, bottom. top, middle
            sticky: false,
        };
        /*
        ARAS es multipolígono. bindTooltip ubica el anchor en un punto interior
        del primer polígono, que no es adecuado en este caso. Tooltip.setLatLong
        {Layer/Tooltip}.openTooltip y Tooltip.addTo son algo incosistentes y
        varían dependiendo de permanent, de si la capa ya ha sido agregada, ...
        Esta forma de hacerlo permite ubicar el punto a mano, sólo es necesario
        escuchar un único evento y funciona bien con capas que se añaden u quitan
        en función del zoom. En versiones posteriores a 1.6 este comportamiento
        parece mejorar.

        Aún así hay que tener en cuenta que se está usando un punto fijo, y
        habria que calcularlo dinámicamente para la porción del multipolígono
        que se esté viendo en el mapa.

        https://github.com/Leaflet/Leaflet/issues/4827
        https://stackoverflow.com/questions/42364619/
        https://github.com/Leaflet/Leaflet/issues/5216
        https://github.com/Leaflet/Leaflet/issues/5758
        https://github.com/Leaflet/Leaflet/issues/6779
        */
        layer.on("add", function() {
            let t = layer.bindTooltip(feature.properties.nome, options).getTooltip();
            layer.openTooltip(layer.getBounds().getCenter());
            layer.off("add", this);
        });
    },

    doStylebacias: function(feature) {
        return {
            weight: 0.6,
            fillColor: "#ffffff",
            dashArray: "5, 5, 1, 5",
            color: "#05328c",
            opacity: 1,
            fillOpacity: 1,
            interactive: false,
        };
    },

    doStylebaciasrepresentacion: function(feature) {
        var ret = {
            weight: 0.52,
            fillColor: "#000000",
            color: "#FFFFFF",
            opacity: 1,
            fillOpacity: 0.2,
            interactive: false,
        };
        switch (feature.properties.nome) {
            case "Zambeze":
            case "Montepuez":
            case "Monapo":
            case "Melela":
            case "Govuro":
                ret.fillColor = "#1e3ca0";
                break;
            case "Save":
            case "Pungue":
            case "Messalo":
            case "Mecuburi":
            case "Ligonha":
            case "Licungo":
            case "Incomati":
                ret.fillColor = "#0a46aa";
                break;
            case "Resto de bacias":
                ret.fillColor = "#0044CE";
                break;
            case "Raraga":
            case "Raraga":
            case "Meluli":
            case "Megaruma":
            case "Inharrime":
                ret.fillColor = "#7d7d7d";
                break;
            case "Lurio":
            case "Rovuma":
            case "Lualua":
            case "Limpopo":
            case "Buzi":
                ret.fillColor = "#1e78b4";
                break;
            case "Gorongozi":
                ret.fillColor = "#05328c";
        }
        return ret;
    },

    doStyleprovincias: function(feature) {
        return {
            weight: 1.2,
            color: "#000000",
            fillColor: "#F6F6F6",
            dashArray: "5, 5, 1, 5",
            opacity: 0.4,
            fillOpacity: 1,
            interactive: false,
        };
    },

    doStylepaises: function(feature) {
        return {
            weight: 0.52,
            color: "#000000",
            fillColor: "#D8D8D8",
            opacity: 1.0,
            fillOpacity: 1,
            interactive: false,
        };
    },

    doStyleoceanos: function(feature) {
        return {
            weight: 0.26,
            color: "#BEE8FF",
            fillColor: "#BEE8FF",
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            opacity: 1.0,
            fillOpacity: 1.0,
            interactive: false,
        };
    },
};
