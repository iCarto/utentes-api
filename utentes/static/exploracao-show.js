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

function getIdFromSearchParams() {
    var searchParams = new URLSearchParams(window.location.search);
    var idParam = searchParams.get("id");
    var id = parseInt(idParam);

    // Check if the id is in the database?
    if (String(id).length !== idParam.length) {
        return NaN;
    }
    return id;
}

var id = getIdFromSearchParams();
if (isNaN(id)) {
    window.location = Backbone.SIXHIARA.Config.urlSearch;
}

var exploracaoModel = new Backbone.SIXHIARA.Exploracao();
exploracaoModel.set("id", id, {silent: true});

var showView = new Backbone.SIXHIARA.ExploracaoShowView({
    el: $("body")[0],
    model: exploracaoModel,
});

exploracaoModel.on("destroy", function(model, collection, options) {
    showView.remove();
});
