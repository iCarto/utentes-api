Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.BlockActivityView = Backbone.View.extend({
    events: {
        "click #editActividade": "renderModal",
    },

    initialize: function(options) {
        this.options = options || {};
        this.subViews = [];

        var tipoAct = this.model.getActividadeTipo();
        // Backbone.SIXHIARA.MSG.NO_ACTIVITY has its own template
        var template = _.template($("[id='" + tipoAct + "']").html());
        this.actividadeView = new Backbone.SIXHIARA.ActividadeView({
            el: this.el,
            model: this.model,
            domains: this.options.domains,
            template: template,
        });
        this.subViews.push(this.actividadeView);
        this.listenTo(this.model.get("actividade"), "all", this.render);
    },

    render: function() {
        _.invoke(this.subViews, "render");
        iAuth.disabledWidgets();
        return this;
    },

    renderModal: function() {
        // override default action for okButtonClicked
        var self = this;
        var ModalActivity = Backbone.SIXHIARA.ModalViewActivity.extend({
            okButtonClicked: function() {
                // in this context, this is the backbone modalView
                if (this.isSomeWidgetInvalid()) return;
                var tipoOld = self.model.get("actividade").get("tipo");
                var tipoNew = this.draftModel.get("tipo");
                if (tipoOld === tipoNew) {
                    var atts = this.draftModel.pick(this.getAttsChanged());
                    self.model.get("actividade").set(atts);
                } else {
                    var newModel = this.draftModel;
                    var newTemplate = _.template($("[id='" + tipoNew + "']").html());
                    self.actividadeView.template = newTemplate;
                    self.stopListening(self.model.get("actividade"));
                    self.model.set("actividade", newModel);
                    self.listenTo(self.model.get("actividade"), "all", self.render);
                    self.model.get("actividade").trigger("change");
                }
                // close modal
                this.$(".modal").modal("hide");
            },
        });
        var modalView = new ModalActivity({
            model: this.model.get("actividade"),
            areaExp: this.model.get("area"),
            selectorTmpl: "#modal-actividades",
            domains: this.options.domains,
        });
        modalView.render();
    },

    remove: function() {
        Backbone.View.prototype.remove.call(this);
        _.invoke(this.subViews, "remove");
    },
});
