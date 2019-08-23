Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.FonteTableRowShowView = Backbone.View.extend({
    tagName: "tr",

    template: _.template(`
        <td class="tipo_agua"><%- tipo_agua %></td>
        <td class="tipo_fonte"><%- tipo_fonte %></td>
        <td class="c_soli"><% print(formatter().formatNumber(c_soli)) %></td>
        <td class="c_real"><% print(formatter().formatNumber(c_real)) %></td>
        <td class="d_dado"><% print(formatter().formatDate(d_dado)) %></td>
        <td class="cadastro"><%- cadastro %></td>
        <td class="lat_lon"><%- lat_lon %></td>
        <td class="observacio"><%- observacio %></td>
        <td class="edit uilib-enability uilib-show-role-administrador uilib-show-role-tecnico"><i class="fas fa-edit"></i></td>
        <td class="delete uilib-enability uilib-show-role-administrador uilib-show-role-tecnico"><i class="fas fa-trash-alt"></i></td>
    `),

    events: {
        "click .edit": "modelUpdate",
    },

    initialize: function(options) {
        this.options = options || {};

        this.model.on("remove", this.remove, this);
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
        this.$("td.cadastro").text(fonte.get("cadastro") || displayNull);
        this.$("td.disp_a").text(fonte.get("disp_a") || displayNull);
        this.$("td.lat_lon").text(fonte.get("lat_lon") || displayNull);
        var c_soli = formatter().formatNumber(fonte.get("c_soli"));
        this.$("td.c_soli").text(c_soli || displayNull);
        var c_max = formatter().formatNumber(fonte.get("c_max"));
        this.$("td.c_max").text(c_max || displayNull);
        var c_real = formatter().formatNumber(fonte.get("c_real"));
        this.$("td.c_real").text(c_real || displayNull);
        var d_dado = formatter().formatDate(fonte.get("d_dado"));
        this.$("td.d_dado").text(d_dado || displayNull);
        this.$("td.sist_med").text(fonte.get("sist_med") || displayNull);
        this.$("td.metodo_est").text(fonte.get("metodo_est") || displayNull);
        this.$("td.observacio").text(fonte.get("observacio") || displayNull);
    },

    modelUpdate: function(e) {
        e.preventDefault();

        var tipoAgua = this.model.get("tipo_agua");
        var modalView = new Backbone.UILib.ModalView({
            modalSelectorTpl: "#block-fonte-modal-tmpl",
            collection: this.model.get("fontes"),
            collectionModel: Backbone.SIXHIARA.Fonte,
            model: this.model,
            domains: this.options.domains,
            creating: false,
            editing: true,
            selectViewWrapper: true,
            domainMap: {
                sist_med: "sistema_medicao",
                disp_a: "piscicultura_fontes_disp_a",
                tipo_fonte: this.options.domains
                    .byCategory("fonte_tipo")
                    .byParent(tipoAgua),
            },
        });
        modalView.render();
    },
});
