Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.EditableTableView = Backbone.View.extend({
    initialize: function(options) {
        this.options = options || {};
        this._subviews = [];
        var self = this;
        $(this.options.newRowBtSelector || "#newRow").on("click", function(e) {
            e.preventDefault();

            var MyModalView = Backbone.SIXHIARA.CultivoResModalView;
            if (self.options.modalSelectorTpl === "#tanqueModalTpl") {
                MyModalView = Backbone.SIXHIARA.TanquePiscicolaModalView;
            }
            if (self.options.modalSelectorTpl === "#user-edit") {
                MyModalView = Backbone.SIXHIARA.UserModalView;
            }
            new MyModalView({
                modalSelectorTpl: self.options.modalSelectorTpl,
                collection: self.collection,
                collectionModel: self.options.collectionModel,
                model: new self.options.collectionModel(),
                domains: self.options.domains,
                deleteFromServer: self.options.deleteFromServer,
                creating: true,
                editing: false,
            }).render();
        });

        var tableView = new Backbone.SIXHIARA.TableView({
            el: $(this.options.tableSelector),
            collection: this.collection,
            rowTemplate: this.options.rowTemplate,
            modalSelectorTpl: this.options.modalSelectorTpl,
            domains: this.options.domains,
            deleteFromServer: this.options.deleteFromServer,
        }).render();

        this._subviews.push(tableView);

        tableView.listenTo(this.collection, "add", function(
            model,
            collection,
            options
        ) {
            this.update(this.collection);
        });
        tableView.listenTo(this.collection, "destroy", function(
            model,
            collection,
            options
        ) {
            this.update(this.collection);
        });
        tableView.listenTo(this.collection, "change", function(
            model,
            collection,
            options
        ) {
            this.update(this.collection);
        });
    },

    remove: function() {
        this.off();
        _.invoke(this._subviews, "off");
        _.invoke(this._subviews, "remove");
        Backbone.View.prototype.remove.call(this);
    },
});

Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.RowView = Backbone.View.extend({
    tagName: "tr",

    events: {
        "click .edit": "modelEdit",
    },

    initialize: function(options) {
        this.options = options || {};
        this.template = _.template(options.rowTemplate);
    },

    render: function() {
        this.$el.append(this.template(this.model.toJSON()));
        new Backbone.SIXHIARA.RowDeleteButtonView({
            model: this.model,
            el: this.$(".delete"),
            question: "Tem certeza de que deseja excluir",
            deleteFromServer: this.options.deleteFromServer,
        });
        return this;
    },

    modelEdit: function() {
        var MyModalView = Backbone.SIXHIARA.CultivoResModalView;
        if (this.options.modalSelectorTpl === "#tanqueModalTpl") {
            MyModalView = Backbone.SIXHIARA.TanquePiscicolaModalView;
        }
        if (self.options.modalSelectorTpl === "#user-edit") {
            MyModalView = Backbone.SIXHIARA.UserModalView;
        }
        new MyModalView({
            modalSelectorTpl: this.options.modalSelectorTpl,
            collection: this.collection, // this.options.model.collection
            collectionModel: this.options.collectionModel, // Backbone.SIXHIARA.TanquePiscicola
            model: this.model, // this.options.model
            domains: this.options.domains,
            editing: true,
            deleteFromServer: self.options.deleteFromServer,
        }).render();
    },
});
