Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonSaveView = Backbone.View.extend({
    events: {
        click: "save",
    },

    initialize: function() {
        this.$el.prop("disabled", true);
        this.listenTo(
            this.model,
            "aChangeHappens",
            function() {
                this.$el.prop("disabled", false);
            },
            this
        );
    },

    save: function() {
        if (this.model.isValid()) {
            this.model.save(null, {
                wait: true,
                success: function(model, resp, options) {
                    window.location = model.urlShow();
                },
                error: function(xhr, textStatus, errorThrown) {
                    if (
                        textStatus &&
                        textStatus.responseJSON &&
                        textStatus.responseJSON.error
                    ) {
                        if (Array.isArray(textStatus.responseJSON.error)) {
                            bootbox.alert(textStatus.responseJSON.error.join("\n"));
                        } else {
                            bootbox.alert(textStatus.responseJSON.error);
                        }
                    } else {
                        bootbox.alert(textStatus.statusText);
                    }
                },
            });
        } else {
            bootbox.alert(this.model.validationError.join("\n"));
        }
    },
});
