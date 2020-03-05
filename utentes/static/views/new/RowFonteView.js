Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.RowFonteView = Backbone.View.extend({
    tagName: "tr",

    template: _.template(`
        <td class="tipo_agua"><%- tipo_agua %></td>
        <td class="tipo_fonte"><%- tipo_fonte %></td>
        <td class="c_soli"><% print(formatter().formatNumber(c_soli)) %></td>
        <td class="observacio"><%- observacio %></td>
        <td class="edit uilib-enability uilib-show-role-administrador uilib-show-role-tecnico"><i class="fas fa-edit"></i></td>
        <td class="delete uilib-enability uilib-show-role-administrador uilib-show-role-tecnico"><i class="fas fa-trash-alt"></i></td>
    `),

    events: {
        "click .edit": "modelUpdate",
    },

    initialize: function(options) {
        this.options = options || {};
        this.model.on("change", this.update, this);
    },

    render: function() {
        this.$el.append(this.template(this.model.toJSON()));
        new Backbone.SIXHIARA.RowDeleteButtonView({
            model: this.model,
            el: this.$(".delete"),
            question: "Tem certeza de que deseja excluir",
        });
        return this;
    },

    update: function() {
        var fonte = this.model;
        var displayNull = "";
        this.$("td.tipo_agua").text(fonte.get("tipo_agua") || displayNull);
        this.$("td.tipo_fonte").text(fonte.get("tipo_fonte") || displayNull);
        var c_soli = formatter().formatNumber(fonte.get("c_soli"));
        this.$("td.c_soli").text(c_soli || displayNull);
        this.$("td.observacio").text(fonte.get("observacio") || displayNull);
    },

    modelUpdate: function(e) {
        e.preventDefault();

        var modaltpl; /* This variable is used to dynamically generate - modalSelectorTpl*/
        if (this.model.get("tipo_agua") === "Superficial") {
            modaltpl = "superficial";
        } else {
            modaltpl = "subterranea";
        }
        var modalView = new Backbone.UILib.ModalView({
            modalSelectorTpl: "#fonte-" + modaltpl + "-modal",
            collection: this.model.get("fontes"),
            collectionModel: Backbone.SIXHIARA.Fonte,
            model: this.model,
            domains: this.options.domains
                .byCategory("fonte_tipo")
                .byParent(this.model.get("tipo_agua")),
            creating: false,
            editing: true,
            selectViewWrapper: true,
            domainMap: {tipo_fonte: "fonte_tipo"},
        });
        modalView.render();
    },
});
