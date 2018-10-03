Backbone.DMS = Backbone.DMS || {};

Backbone.DMS.FileModalView = function (options) {
    this.options = options || {};

    this.title = options.title

    this.template = _.template(
        '<div class="modal fade" id="documents-modal" tabindex="-1" role="dialog" aria-labelledby="editInfoModalLabel">' +
            '<div class="modal-dialog" role="document">' +
                '<div class="modal-content">' +
                    '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Pechar"><span aria-hidden="true">&times;</span></button>' +
                        '<h4 class="modal-title" id="editInfoModalLabel"><%=title%></h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                        '<nav class="navbar  navbar-expand-lg navbar-light bg-light">' +
                        '</nav>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                        '<div class="row">' +
                            '<div class="col-xs-offset-1 col-xs-10">' +
                                '<button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>'
    );

    this.model = options.model;

    Backbone.View.apply(this, [options]);
};

_.extend(Backbone.DMS.FileModalView.prototype, Backbone.View.prototype, {

    navbarTemplate: _.template(''),

    render: function() {
        this.$el.empty();
        this.$el.html(this.template({
            title: this.title
        }));
        this.$el.find('.navbar').append(this.navbarTemplate(this.model.toJSON()));

        var folderView = new Backbone.DMS.FolderView({
            model: this.model
        })

        this.$el.find('.modal-body').append(folderView.$el)

        return this;
    },

    show: function() {
        $(document.body).append(this.render().el);
        var self = this;

        this.$('.modal').on('hidden.bs.modal', function(){
            self._close();
        });
        this.$('.modal').modal('show');
    },

    _close: function() {
        this.$('.modal').unbind();
        this.$('.modal').remove();
        this.remove();
    },

    remove: function() {
        this.$el.unbind();
        this.off();
        Backbone.View.prototype.remove.call(this);
    }

});

Backbone.DMS.FileModalView.extend = Backbone.View.extend;
