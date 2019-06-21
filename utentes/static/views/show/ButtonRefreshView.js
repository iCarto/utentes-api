Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonRefreshView = Backbone.View.extend({
    events: {
        click: "doClick",
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

    doClick: function() {
        bootbox.confirm("Se ele aceita perder alterações", result => {
            if (result) {
                window.location = this.model.urlShow();
            }
        });
    },
});
