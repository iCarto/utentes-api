Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TanquePiscicola = Backbone.GeoJson.Feature.extend({
    defaults: {
        tanque_id: null,
        tipo: null,
        cumprimen: null,
        largura: null,
        profundid: null,
        area: null,
        area_gps: null,
        volume: null,
        estado: null,
        esp_culti: null,
        esp_cul_o: null,
        tipo_alim: null,
        tipo_al_o: null,
        n_ale_pov: null,
        prov_alev: null,
        prov_al_o: null,
        venda: null,
        consumo: null,
        pro_anual: null,
        peso_med: null,
        fert_agua: null,
        fert_a_o: null,
        observacio: null,
        the_geom: new Backbone.Model(),
    },

    initialize: function(options) {
        this.on("change:cumprimen change:largura", this.updateArea, this);
        this.on(
            "change:cumprimen change:largura change:profundid",
            this.updateVolume,
            this
        );
        this.on("change:venda change:consumo", this.updateProAnual, this);
    },

    validate: function(attrs, options) {
        var messages = [];
        validator(ActividadeSchema["TanquesPiscicolas"])
            .validate(this.toJSON())
            .forEach(function(msg) {
                messages.push(msg);
            });
        if (messages.length > 0) return messages;
    },

    updateArea: function() {
        var cumprimen = this.get("cumprimen");
        var largura = this.get("largura");
        var area = null;
        if (cumprimen !== null && largura !== null) {
            area = cumprimen * largura;
        }
        this.set("area", area);
    },

    updateVolume: function() {
        var cumprimen = this.get("cumprimen");
        var largura = this.get("largura");
        var profundid = this.get("profundid");
        var volume = null;
        if (cumprimen !== null && largura !== null && profundid !== null) {
            volume = cumprimen * largura * profundid;
        }
        this.set("volume", volume);
    },

    updateProAnual: function() {
        var venda = this.get("venda");
        var consumo = this.get("consumo");
        var pro_anual = null;
        if (venda !== null && consumo !== null) {
            pro_anual = venda + consumo;
        }
        this.set("pro_anual", pro_anual);
    },
});
