Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FileUploadingView = Backbone.View.extend({
    tagName: "div",
    className: "file-uploading",

    events: {
        "click .fa-close": "removeFile",
    },

    template: _.template(
        '<div class="data">' +
            "<span><%=data.name%></span>" +
            '<i class="fa fa-close"></i>' +
            "</div>" +
            '<div class="bar-container" style="width: 100%;">' +
            "<span></span>" +
            '<div class="bar" style="width: 0%;"></div>' +
            "</div>"
    ),

    initialize: function() {
        this.createListeners();
        _.bindAll(this, "updateProgress");
    },

    createListeners: function() {
        this.listenTo(this.model, "change:progress", this.updateProgress);
    },

    render: function() {
        this.$el.html(
            this.template({
                data: this.model.get("data").files[0],
            })
        );
        this.updateText();
        return this;
    },

    updateProgress: function(progress) {
        this.$el.find(".bar").css("width", this.model.get("progress") + "%");
        this.updateText(progress);
    },

    updateText: function(progress) {
        var text = "";
        if (!progress) {
            text = "Pendente para salvar";
        } else if (progress == 100) {
            text = "Salvado";
        } else {
            text = "Salvando...";
        }
        this.$el.find(".bar-container span").text(text);
    },

    removeFile: function() {
        this.model.trigger("destroy", this.model);
    },
});
