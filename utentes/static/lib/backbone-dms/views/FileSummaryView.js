Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FileSummaryView = Backbone.View.extend({
    tagName: "tr",

    events: {
        "click #delete-button": "deleteFile",
    },

    template: _.template(
        '<td class="type"><i class="fas fa-file"></i></td>' +
            '<td class="name"><a id="download-button" href="<%=downloadUrl%>" target="_blank"><%=data.name%></a></td>' +
            '<td class="date"><%=formatDate(data.date)%></td>' +
            '<td class="size"><%=formatBytes(data.size, 2)%></td>' +
            '<td class="actions"></td>'
    ),

    templateDownloadButton: _.template(
        '<a id="download-button" href="<%=downloadUrl%>" target="_blank"><i class="fas fa-download"></i></</a>'
    ),

    templateDeleteButton: _.template(
        '<a id="delete-button" href="#"><i class="fas fa-trash-alt"></i></</a>'
    ),

    initialize: function() {
        _.bindAll(this, "deleteFile");
    },

    render: function() {
        this.$el.html(
            this.template({
                data: this.model.toJSON(),
                downloadUrl: this.model.url(),
                formatDate: Util.formatDate,
                formatBytes: Util.formatBytes,
            })
        );
        this.showDownloadButton();
        this.showDeleteButton();
        return this;
    },

    showDownloadButton: function() {
        if (
            !this.model.get("permissions") ||
            _.contains(this.model.get("permissions"), PERMISSION_DOWNLOAD)
        ) {
            this.$el.children(".actions").append(
                this.templateDownloadButton({
                    downloadUrl: this.model.url(),
                })
            );
        }
    },

    showDeleteButton: function() {
        if (
            !this.model.get("permissions") ||
            _.contains(this.model.get("permissions"), PERMISSION_DELETE)
        ) {
            this.$el.children(".actions").append(this.templateDeleteButton());
        }
    },

    deleteFile: function() {
        bootbox.confirm("Se você aceitar, o documento é eliminado", result => {
            if (result) {
                this.model.destroy({
                    error: function(model, response, error) {
                        var errorText = error.errorThrown;
                        if (response.responseJSON) {
                            errorText = response.responseJSON.error;
                        }
                        bootbox.alert(errorText);
                    },
                    wait: true, // wait for the response before calling "remove" event
                });
            }
        });
    },
});
