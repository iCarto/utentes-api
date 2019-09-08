Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.FacturaStatsCollection = Backbone.Collection.extend({
    model: Backbone.SIXHIARA.FacturaStats,

    initialize: function(models, options) {
        this.options = options || {};
    },

    url: function() {
        var url = "/api/facturacao/stats";
        if (this.options.filter) {
            url += "?";
            for (var filterField in this.options.filter.attributes) {
                if (this.options.filter.attributes[filterField]) {
                    if (filterField == "utente") {
                        this.options.filter.attributes[filterField].forEach(function(
                            utente
                        ) {
                            url += filterField + "=" + utente + "&";
                        });
                    } else {
                        url +=
                            filterField +
                            "=" +
                            this.options.filter.attributes[filterField] +
                            "&";
                    }
                }
            }
        }
        return url;
    },
});
