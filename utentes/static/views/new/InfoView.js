Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.InfoView = Backbone.View.extend({
    initialize: function(options) {
        this.options = options || {};

        var self = this;

        var exp_id = document.getElementById("exp_id");
        exp_id.addEventListener("input", function() {
            $("#form-exp_id-warning-message").hide();
            var expList = self.options.expedientes.get("list");
            for (var exp in expList) {
                if (expList[exp]["exp_id"] === exp_id.value) {
                    $("#form-exp_id-warning-message").show();
                    return;
                }
            }
        });

        var exp_name = document.getElementById("exp_name");
        exp_name.addEventListener("input", function() {
            $("#form-exp_name-warning-message").hide();
            var expList = self.options.expedientes.get("list");
            var newName = accentNeutralise(exp_name.value);
            for (var exp in expList) {
                var existentName = accentNeutralise(expList[exp]["exp_name"]);
                if (existentName === newName) {
                    $("#form-exp_name-warning-message").show();
                    return;
                }
            }
        });

        var dateId = "d_soli";
        var dateWidget = document.getElementById(dateId);
        dateWidget.addEventListener("input", function(e) {
            var dateWidget = e.target;
            var validDate = formatter().validDateFormat(dateWidget.value);
            if (validDate) {
                dateWidget.setCustomValidity("");
            } else {
                dateWidget.setCustomValidity("A data deve ter o formato correcto");
            }
        });
    },
});
