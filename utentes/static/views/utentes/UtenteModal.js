Backbone.SIXHIARA.UtenteModal = Backbone.UILib.ModalView.extend({
    okButtonClicked: function() {
        if (this.isSomeWidgetInvalid()) return;
        var atts = this.widgetModel.pick(this.getAttsChanged());
        this.model.set(atts);
        if (!this.model.isValid()) {
            bootbox.alert(this.model.validationError);
            return;
        }

        // update in server
        var self = this;
        this.collection.create(this.model, {
            merge: true,
            wait: true,
            success: function(model, resp, options) {
                self.$(".modal").modal("hide");
                self.options.tableUtentes.reset();
            },
            error: function(xhr, textStatus, errorThrown) {
                if (
                    textStatus &&
                    textStatus.responseJSON &&
                    textStatus.responseJSON.error
                ) {
                    var errorMsg = textStatus.responseJSON.error;
                    if (Array.isArray(errorMsg)) {
                        errorMsg = errorMsg.join("\n");
                    }
                    bootbox.alert(errorMsg);
                } else {
                    bootbox.alert(textStatus.statusText);
                }
            },
        });
    },
    customConfiguration: function() {
        // connect auxiliary views
        var selectLocationView = new Backbone.SIXHIARA.SelectLocationView({
            el: this.$("#editUtenteModal"),
            model: this.widgetModel,
            domains: this.options.domains,
            domainsKeys: ["utentes-provincia", "utentes-distrito", "utentes-posto"],
        }).render();
        this._addAuxView(selectLocationView);

        var selectUtenteTipo = new Backbone.UILib.SelectView({
            el: this.$("#uten_tipo"),
            collection: this.options.domains.byCategory("utentes_uten_tipo"),
        }).render();
        this._addAuxView(selectUtenteTipo);

        iAuth.disabledWidgets("#editUtenteModal");
    },
});
