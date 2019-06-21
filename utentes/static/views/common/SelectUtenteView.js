Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SelectUtenteView = Backbone.View.extend({
    events: {
        "change #select-utente": "fillInputsEvent",
    },

    initialize: function(options) {
        this.options = options || {};
    },

    render: function() {
        this.collection.models.forEach(this.appendOption, this);
        return this;
    },

    appendOption: function(utente) {
        var option = new Backbone.UILib.OptionView({
            model: utente,
            text: "nome",
            attributes: {value: utente.get("nome")},
        });
        if (this.model && this.model.get("utente").get("nome") === utente.get("nome")) {
            option.$el.attr("selected", "selected");
            this.fillInputs(option.model.get("nome"));
        }
        this.$("#select-utente").append(option.render().$el);
    },

    fillInputsEvent: function(e) {
        // update widgets
        var selectedOption = e.target.selectedOptions[0].value;
        this.fillInputs(selectedOption);
    },

    fillInputs: function(selectedOption) {
        var utente = this.collection.findWhere({nome: selectedOption});
        if (utente === undefined) {
            this.$(".widget-utente").each(function(index, widget) {
                // enable widgets and clear values
                widget.removeAttribute("disabled");
                widget.value = "";
                $(widget).trigger("input");
            });
            if (this.model) this.model.set("utente", new Backbone.SIXHIARA.Utente());
        } else {
            this.$(".widget-utente").each(function(index, widget) {
                // disable widgets and set values from model
                widget.setAttribute("disabled", true);
                widget.value = utente.get(widget.id);
                $(widget).trigger("input");
            });
            if (this.model) this.model.set("utente", utente);
        }
    },
});
