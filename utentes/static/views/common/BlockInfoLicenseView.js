Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockInfoLicenseView = Backbone.View.extend({
    template: _.template(
        '<div class="col-lg-6">' +
            '<div class="alert <%- colorClass %> alert-system-top-message ">' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            "<%- infoMessage %>" +
            "</div>" +
            "</div>"
    ),

    initialize: function() {
        var model = this.model;
        if (
            model.get("lic_time_enough") ||
            model.get("lic_time_over") ||
            model.get("lic_time_warning")
        ) {
            var time_info = model.get("lic_time_info");
            var message;

            if (time_info) {
                if (time_info == "Prazo esgotado" || time_info == "Licença cadudada") {
                    message = time_info;
                } else {
                    message =
                        "Ficam " + time_info + " para o fim do prazo de licenciamento";
                }
            } else {
                message = "Sem informação";
            }

            var colorClass = model.get("lic_time_over")
                ? "alert-danger"
                : model.get("lic_time_warning")
                ? "alert-warning"
                : model.get("lic_time_enough")
                ? "alert-success"
                : "alert-default";
            this.$el.removeClass("invisible");
            this.$el.addClass("visible");
            this.showAlert(this, message, colorClass);
        } else {
            this.$el.removeClass("visible");
            this.$el.addClass("invisible");
        }
    },

    showAlert: function(model, message, colorClass) {
        $("#license-info").html("");
        $("#license-info").append(
            this.template({
                infoMessage: message,
                colorClass: colorClass,
            })
        );
    },
});
