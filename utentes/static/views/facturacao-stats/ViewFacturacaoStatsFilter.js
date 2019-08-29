Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ViewFacturacaoStatsFilter = Backbone.View.extend({
    tagName: "div",

    id: "view-facturacao-filters",
    className: "view-facturacao-filters",

    template: _.template(`
        <div class="row">
            <div class="col-xs-12">
                <div>
                    <label for="utente">Utente</label>
                    <select class="form-control widget" id="utente" multiple size="15" style="height: 100%;">
                    </select>
                </div>
            </div>
            <div class="col-xs-12">
                <div id="filter-dates-view"></div>
            </div>
            <div class="col-xs-12">
                <div>
                    <label for="tipo_agua">Tipo de Água</label>
                    <select class="form-control widget" id="tipo_agua">
                    </select>
                </div>
            </div>
            <div class="col-xs-12">
                <div>
                    <label for="uso_explotación">Uso</label>
                    <select class="form-control widget" id="uso_explotacion">
                    </select>
                </div>
            </div>
        </div>
    `),

    initialize: function(options) {
        var self = this;

        this.options = options || {};

        this.datesView = new Backbone.SIXHIARA.FilterDatesView({
            model: this.model,
        });

        /* Take Care. Necesita Refactoring. Estamos usando una cadena vacía para representar el blanco
        de este modo cuando se coge el valor $("#tipo_agua").val() devuelve
        esa cadena vacía y el código que hace la petición a la API si está vacía
        no le pasa ese query parameter. Con otras opciones puede que acabe enviando
        un String("null") a la api.
        */
        this.domains = new Backbone.UILib.DomainCollection([
            {category: "licencia_tipo_agua", text: ""},
            {category: "licencia_tipo_agua", text: "Subterrânea"},
            {category: "licencia_tipo_agua", text: "Superficial"},
            {category: "uso_explotacion", text: ""},
            {category: "uso_explotacion", text: "Usos privativos"},
            {category: "uso_explotacion", text: "Usos comuns"},
        ]);
    },

    updateTiposAgua: function() {
        var self = this;
        var licenciasTipoAgua = this.domains.byCategory("licencia_tipo_agua");
        licenciasTipoAgua.each(function(licenciaTipoAgua) {
            var o = new Option(
                licenciaTipoAgua.get("text"),
                licenciaTipoAgua.get("text")
            );
            $(o).html(licenciaTipoAgua.get("text"));
            self.$el.find("#tipo_agua").append(o);
        });
    },

    updateUsoExplotacion: function() {
        var self = this;
        var licenciasTipoAgua = this.domains.byCategory("uso_explotacion");
        licenciasTipoAgua.each(function(licenciaTipoAgua) {
            var o = new Option(
                licenciaTipoAgua.get("text"),
                licenciaTipoAgua.get("text")
            );
            $(o).html(licenciaTipoAgua.get("text"));
            self.$el.find("#uso_explotacion").append(o);
        });
    },

    updateUtentes: function(utentes) {
        var self = this;
        this.$el
            .find("#utente")
            .find("option")
            .remove();
        utentes.forEach(function(utente) {
            var o = new Option(utente.id, utente.id);
            $(o).html(utente.nome);
            self.$el.find("#utente").append(o);
        });
    },

    areUtentesLoaded: function() {
        return $("#utente").children().length != 0;
    },

    removeListeners: function() {
        this.$("#tipo_agua").off("change");
        this.$("#utente").off("change");
    },

    setListeners: function() {
        var self = this;
        this.$("#tipo_agua").on("change", function() {
            self.model.set("tipo_agua", self.$("#tipo_agua").val());
        });
        this.$("#uso_explotacion").on("change", function() {
            self.model.set("uso_explotacion", self.$("#uso_explotacion").val());
        });
        this.$("#utente").on("change", function() {
            self.model.set("utente", self.$("#utente").val());
        });
    },

    render: function() {
        this.removeListeners();
        this.$el.html(this.template);
        this.$el.find("#filter-dates-view").html(this.datesView.render().el);
        this.updateTiposAgua();
        this.updateUsoExplotacion();
        this.setListeners();
        return this;
    },
});
