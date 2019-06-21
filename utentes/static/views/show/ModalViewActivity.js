Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ModalViewActivity = Backbone.View.extend({
    // TODO: shall we inherit from UILib.ModalView?

    events: {
        "click #okButton": "okButtonClicked",
    },

    initialize: function(options) {
        this.options = options || {};
        // we keep two auxiliary arrays:
        // - MODALSUBVIEWS: the ones that are valid while the modal is open.
        //
        //   These are added when the modal is created and removed when the modal is removed.
        //
        //   * the domain filler for tipo field (UILib.SelectView)
        //   * the view to update the model from widgets changes (UILib.WidgetsView)
        //
        // - ACTIVITYSUBVIEWS: the ones that depend on the selected activity.
        //
        //   These are added and removed when the user changes the type of activity.
        //
        //   * Every domain filler used by a specific activity (UILib.SelectView)
        this.modalSubViews = [];
        this.activitySubviews = [];

        if (!this.options.selectorTmpl) throw "You need to provide a selector template";

        // take the modal template
        var selectorTmpl = this.options.selectorTmpl;
        this.template = _.template($(selectorTmpl).html());

        // create a draftModel to work "offline" and inject template for activity
        this.draftModel = this.model.clone();
        this.insideTmpl = _.template(
            $("[id='" + this.draftModel.get("tipo") + "_edit']").html()
        );
        // TODO: also add domain fillers for each activity

        // append both templates to DOM
        this.$el.html(this.template(this.draftModel.toJSON()));
        this.$("#actividade-render-modal").append(
            this.insideTmpl(this.draftModel.toJSON())
        );
        $(document.body).append(this.el);

        // if tipo changes, we need to update draftModel and insideTmpl
        this.listenTo(this.draftModel, "change:tipo", this.updateActivity);

        // connect events:
        // - modal and its subviews would be removed from DOM on close
        var self = this;
        this.$(".modal").on("hidden.bs.modal", function() {
            // this is the modal itself
            $(this).remove();
            self.remove();
        });

        // Configuration of "disabled" prop of asis_or_o
        var origenAsistenciaOutros = this.$("#asis_or_o");
        if (this.draftModel.get("asis_orig") === "Outros") {
            origenAsistenciaOutros.prop("disabled", false);
        }

        this.listenTo(this.draftModel, "change:asis_orig", function(
            model,
            value,
            options
        ) {
            if (value === "Outros") {
                origenAsistenciaOutros.prop("disabled", false);
            } else {
                model.set("asis_or_o", null);
                origenAsistenciaOutros.prop("disabled", true);
                origenAsistenciaOutros.val("");
            }
        });

        // Configuration of "disabled" prop of prob_prin
        var principaisProblemas = this.$("#prob_prin");
        if (this.draftModel.get("problemas") === "Sim") {
            principaisProblemas.prop("disabled", false);
        }

        this.listenTo(this.draftModel, "change:problemas", function(
            model,
            value,
            options
        ) {
            if (value === "Sim") {
                principaisProblemas.prop("disabled", false);
            } else {
                model.set("prob_prin", null);
                principaisProblemas.prop("disabled", true);
                principaisProblemas.val("");
            }
        });
    },

    addModalSubview: function(view) {
        this.modalSubViews.push(view);
        return view;
    },

    addActivitySubview: function(view) {
        this.activitySubviews.push(view);
        return view;
    },

    updateActivity: function(model, value, options) {
        // we are going to change the DOM (add/remove nodes that this view is listen to)
        // and also to update the model. Unbind events and reconnect them at the end.
        this.widgetsView.undelegateEvents();

        var tipo = model.get("tipo") || Backbone.SIXHIARA.MSG.NO_ACTIVITY;

        // we are about to update model, so stop listening the old model
        // and start listening the new one
        this.stopListening(this.draftModel, "change:tipo", this.updateActivity);
        this.draftModel = null;
        this.draftModel = new Backbone.SIXHIARA.ActividadesFactory[tipo]();
        this.listenTo(this.draftModel, "change:tipo", this.updateActivity);

        // update the modal contents for this specific activity
        this.insideTmpl = _.template($("[id='" + tipo + "_edit']").html());
        this.$("#actividade-render-modal").html("");
        this.$("#actividade-render-modal").append(
            this.insideTmpl(this.draftModel.toJSON())
        );
        this.updateActivitySubviews();

        this.widgetsView.model = this.draftModel;
        // reconnect events on the DOM, which happen to have changed
        // so the nodes the view is listen to are different
        this.widgetsView.delegateEvents(this.widgetsView.events);
    },

    updateActivitySubviews: function() {
        _.invoke(this.activitySubviews, "remove");
        this.activitySubviews = [];
        var tipo = this.draftModel.get("tipo");
        if (tipo === "Indústria") {
            var industrias = this.options.domains.byCategory("industria_tipo");
            var selectIndustria = new Backbone.UILib.SelectView({
                el: this.$("#tipo_indus"),
                collection: industrias,
            }).render();
            this.addActivitySubview(selectIndustria);
            var impactos = this.options.domains.byCategory("boolean");
            var selectImpacto = new Backbone.UILib.SelectView({
                el: this.$("#eval_impac"),
                collection: impactos,
            }).render();
            this.addActivitySubview(selectImpacto);
            var cEstimadoView = new Backbone.SIXHIARA.CEstimadoComputedView({
                el: this.$("#c_estimado_computed"),
                areaExp: this.options.areaExp,
            }).render();
            this.addActivitySubview(cEstimadoView);
        } else if (tipo === "Producção de energia") {
            var energias = this.options.domains.byCategory("energia_tipo");
            var selectImpacto = new Backbone.UILib.SelectView({
                el: this.$("#energia_tipo"),
                collection: energias,
            }).render();
            this.addActivitySubview(selectImpacto);
            var impactos = this.options.domains.byCategory("boolean");
            var selectImpacto = new Backbone.UILib.SelectView({
                el: this.$("#eval_impac"),
                collection: impactos,
            }).render();
            this.addActivitySubview(selectImpacto);
        } else if (tipo === "Piscicultura") {
            var tipo_aqua = this.options.domains.byCategory(
                "actividades_piscicultura_tipo_aqua"
            );
            var select_tipo_aqua = new Backbone.UILib.SelectView({
                el: this.$("#tipo_aqua"),
                collection: tipo_aqua,
            }).render();
            this.addActivitySubview(select_tipo_aqua);
            var tipo_proc = this.options.domains.byCategory("piscicultura_tipo_proc");
            var select_tipo_proc = new Backbone.UILib.SelectView({
                el: this.$("#tipo_proc"),
                collection: tipo_proc,
            }).render();
            this.addActivitySubview(select_tipo_proc);
            var asis_aber = this.options.domains.byCategory("boolean");
            var select_asis_aber = new Backbone.UILib.SelectView({
                el: this.$("#asis_aber"),
                collection: asis_aber,
            }).render();
            this.addActivitySubview(select_asis_aber);
            var asis_moni = this.options.domains.byCategory("boolean");
            var select_asis_moni = new Backbone.UILib.SelectView({
                el: this.$("#asis_moni"),
                collection: asis_moni,
            }).render();
            this.addActivitySubview(select_asis_moni);
            var trat_t_en = this.options.domains.byCategory("boolean");
            var select_trat_t_en = new Backbone.UILib.SelectView({
                el: this.$("#trat_t_en"),
                collection: trat_t_en,
            }).render();
            this.addActivitySubview(select_trat_t_en);
            var trat_a_sa = this.options.domains.byCategory("boolean");
            var select_trat_a_sa = new Backbone.UILib.SelectView({
                el: this.$("#trat_a_sa"),
                collection: trat_a_sa,
            }).render();
            this.addActivitySubview(select_trat_a_sa);
            var gaio_subm = this.options.domains.byCategory("piscicultura_subm");
            var select_gaio_subm = new Backbone.UILib.SelectView({
                el: this.$("#gaio_subm"),
                collection: gaio_subm,
            }).render();
            this.addActivitySubview(select_gaio_subm);
            var problemas = this.options.domains.byCategory("boolean");
            var select_problemas = new Backbone.UILib.SelectView({
                el: this.$("#problemas"),
                collection: problemas,
            }).render();
            this.addActivitySubview(select_problemas);

            var espCultiChbList = new Backbone.SIXHIARA.CheckBoxList({
                model: this.draftModel,
                model_attr_name: "esp_culti",
                el: this.$(".modal").find("#esp_culti"),
            }).render();

            var provAlevChbList = new Backbone.SIXHIARA.CheckBoxList({
                model: this.draftModel,
                model_attr_name: "prov_alev",
                el: this.$(".modal").find("#prov_alev"),
            }).render();

            var asisOrigChbList = new Backbone.SIXHIARA.CheckBoxList({
                model: this.draftModel,
                model_attr_name: "asis_orig",
                el: this.$(".modal").find("#asis_orig"),
                enable_others: {
                    childId: "asis_or_o",
                    enabledValues: "Outros",
                },
            }).render();
        }
    },

    render: function() {
        // connect modal subviews to fill select tipo with domain data
        var actividades = this.options.domains.byCategory("actividade");
        var selectView = new Backbone.UILib.SelectView({
            el: this.$("#tipo"),
            collection: actividades,
        }).render();
        this.addModalSubview(selectView);

        this.updateActivitySubviews();

        this.widgetsView = new Backbone.UILib.WidgetsView({
            el: this.$el,
            model: this.draftModel,
        }).render();
        this.addModalSubview(this.widgetsView);

        this.$(".modal").modal("show");
    },

    remove: function() {
        Backbone.View.prototype.remove.call(this);
        _.invoke(this.modalSubViews, "remove");
        _.invoke(this.activitySubviews, "remove");
        this.modalSubViews = [];
        this.activitySubviews = [];
    },

    okButtonClicked: function() {
        // // overwritten in BlockActivityView
        // if(this.isSomeWidgetInvalid()) return;
        // var atts = this.draftModel.pick(this.getAttsChanged());
        // this.model.set(atts);
        // this.$('.modal').modal('hide');
    },

    isSomeWidgetInvalid: function() {
        // we only use Constraint API with input elements, so check only those
        var widgets = this.$(".modal").find(
            "input.widget, input.widget-number, input.widget-date"
        );
        var someInvalid = false;
        widgets.each(function(index, widget) {
            if (!widget.validity.valid) {
                someInvalid = true;
            }
        });
        return someInvalid;
    },

    getAttsChanged: function() {
        var widgets = this.$(".modal").find(
            ".widget, .widget-number, .widget-date, .widget-boolean, .widget-external"
        );
        var widgetsId = _.map(widgets, function(w) {
            return w.id;
        });
        return widgetsId;
    },
});
