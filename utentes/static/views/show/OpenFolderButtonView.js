Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.OpenFolderButtonView = Backbone.View.extend({
    events: {
        click: "doClick",
    },

    doClick: function() {
        var setting = new Backbone.SIXHIARA.Setting();
        setting.fetch({
            success: function() {
                var docPath = setting.get("docPath");
                nodeRequire("shell").openItem(docPath);
            },
        });
    },
});
