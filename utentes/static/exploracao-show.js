$(document).ready(function() {
    exploracaoModel.fetch({
        parse: true,
        success: function() {
            showView.render();
            iAuth.disabledWidgets();
        },
        error: function() {
            window.location = Backbone.SIXHIARA.Config.urlSearch;
        },
    });
});

function idIsNotValid(id) {
    // TODO: check id against all id in collection
    return id === undefined || id === null || id === "";
}

var exploracaoModel = new Backbone.SIXHIARA.Exploracao();
exploracaoModel.set("id", window.location.search.split("=")[1], {silent: true});
if (idIsNotValid(exploracaoModel.get("id"))) {
    window.location = Backbone.SIXHIARA.Config.urlSearch;
}

var showView = new Backbone.SIXHIARA.ExploracaoShowView({
    el: $("body")[0],
    model: exploracaoModel,
});

exploracaoModel.on("destroy", function(model, collection, options) {
    showView.remove();
});
