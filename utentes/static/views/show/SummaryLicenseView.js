Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SummaryLicenseView = Backbone.View.extend({
    render: function() {
        if (this.model.get("summary_licencia_val")) {
            this.$el.removeClass("label-danger").addClass("label-success");
        } else {
            this.$el.removeClass("label-success").addClass("label-danger");
        }

        return this;
    },
});
