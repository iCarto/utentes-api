Backbone.DMS = Backbone.DMS || {};

Backbone.DMS.FileModalView = function(options) {
    this.options = options || {};

    this.title = options.title;

    this.template = _.template(
        '<div class="modal fade" id="documents-modal" tabindex="-1" role="dialog" aria-labelledby="editInfoModalLabel">' +
            '<div class="modal-dialog" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-label="Pechar"><span aria-hidden="true">&times;</span></button>' +
            '<h4 class="modal-title" id="editInfoModalLabel"><%=title%></h4>' +
            "</div>" +
            '<div class="modal-body">' +
            "</div>" +
            '<div class="modal-footer">' +
            '<div class="row">' +
            '<div class="col-xs-offset-1 col-xs-10">' +
            '<button type="button" class="close-button btn btn-default" data-dismiss="modal">Fechar</button>' +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>" +
            "</div>"
    );

    if (options.openElementId) {
        $(options.openElementId).on("click", this.show.bind(this));
    }

    this.model = new Backbone.DMS.Folder();

    this.folderView = new Backbone.DMS.FolderView({
        model: this.model,
        viewPermissions: this.options.permissions,
        uploadInmediate: this.options.uploadInmediate,
        components: this.options.components,
    });

    Backbone.View.apply(this, [options]);
};

_.extend(Backbone.DMS.FileModalView.prototype, Backbone.View.prototype, {
    render: function() {
        this.$el.empty();
        this.$el.html(
            this.template({
                title: this.title,
            })
        );

        this.$el.find(".modal-body").append(this.folderView.render().el);

        return this;
    },

    initModel: function() {
        if (this.options.urlBase) {
            this.setUrlBase(this.options.urlBase);
        }
        if (this.options.id) {
            this.setId(this.options.id);
        }
        if (this.options.urlBase && this.options.id) {
            this.model.fetch();
        }
    },

    setUrlBase: function(urlBase) {
        this.model.urlRoot = urlBase;
    },

    setId: function(id) {
        this.model.set("id", id);
    },

    show: function() {
        this.initModel();
        $(document.body).append(this.render().el);

        var self = this;

        this.$(".modal").on("hidden.bs.modal", function() {
            self._close();
        });
        this.$(".modal").modal("show");
    },

    onShown: function(callback, options) {
        this.$(".modal").on("shown.bs.modal", function() {
            callback(options);
        });
    },

    _close: function() {
        this.$(".modal").unbind();
        this.$(".modal").remove();
        this.remove();
    },

    remove: function() {
        this.$el.unbind();
        this.off();
        Backbone.View.prototype.remove.call(this);
    },

    hasPendingFiles: function() {
        return this.folderView.hasPendingFiles();
    },

    saveFiles: function(options) {
        this.folderView.saveFiles(options);
    },

    hideCloseButton: function() {
        this.$(".close-button").hide();
    },
});

Backbone.DMS.FileModalView.extend = Backbone.View.extend;
