Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ActividadeView = Backbone.View.extend({
    initialize: function(options) {
        this.options = options || {};
        this.template = this.options.template;
        this.options.domains = this.options.domains;
        this.subViews = [];
    },

    render: function() {
        var tipo = this.model.getActividadeTipo();
        var atts =
            (this.model.get("actividade") && this.model.get("actividade").toJSON()) ||
            {};

        _.invoke(this.subViews, "remove");
        this.subViews = [];

        this.$("#actividade").text(tipo);

        this.$("#actividade-render").html("");
        this.$("#actividade-render").append(this.template(atts));

        if (tipo === "Pecuária") {
            var table = new Backbone.SIXHIARA.EditableTableView({
                el: this.$("#block-pecuaria"),
                newRowBtSelector: "#newRow",
                modalSelectorTpl: "#resModalTpl",
                tableSelector: "table#reses",
                collection: this.model.get("actividade").get("reses"),
                rowTemplate:
                    '<td><% print(formatter().formatNumber(c_estimado)) %></td><td><%- reses_tipo %></td><td><% print(formatter().formatNumber(reses_nro)) %></td><td><%- observacio %></td><td class="edit uilib-enability uilib-show-role-administrador uilib-show-role-tecnico"><i class="fa fa-pencil-square-o"></i></td><td class="delete uilib-enability uilib-show-role-administrador uilib-show-role-tecnico"><i class="fa fa-trash"></i></td>',
                collectionModel: Backbone.SIXHIARA.ActividadeRes,
                domains: this.options.domains,
            });
            this.subViews.push(table);
        } else if (tipo === "Agricultura de Regadio") {
            var table = new Backbone.SIXHIARA.EditableTableView({
                el: this.$("#block-regadia"),
                newRowBtSelector: "#newRow",
                modalSelectorTpl: "#cultivoModalTpl",
                tableSelector: "table#cultivos",
                collection: this.model.get("actividade").get("cultivos"),
                rowTemplate:
                    '<td><%- cult_id %></td><td><% print(formatter().formatNumber(c_estimado)) %></td><td><%- cultivo %> / <%- rega %> </td><td> <% print(formatter().formatNumber(eficiencia)) %> </td><td><% print(formatter().formatNumber(area, "0[,]000[.]0000")) %></td><td><%- observacio %></td><td class="edit uilib-enability uilib-show-role-administrador uilib-show-role-tecnico"><i class="fa fa-pencil-square-o"></i></td><td class="delete uilib-enability uilib-show-role-administrador uilib-show-role-tecnico"><i class="fa fa-trash"></i></td>',
                collectionModel: Backbone.SIXHIARA.ActividadeCultivo,
                domains: this.options.domains,
            });
            this.subViews.push(table);
        } else if (tipo === "Piscicultura") {
            var table = new Backbone.SIXHIARA.EditableTableView({
                el: this.$("#block-piscicultura"),
                newRowBtSelector: "#newRow",
                modalSelectorTpl: "#tanqueModalTpl",
                tableSelector: "table#tanques",
                collection: this.model.get("actividade").get("tanques_piscicolas"),
                rowTemplate:
                    '<td><%- tanque_id %></td><td><%- tipo %></td><td><%- formatter().formatNumber(volume) %></td><td><%- estado %></td><td><%- esp_culti %></td><td><%- tipo_alim %></td><td><%- n_ale_pov %></td><td><%- formatter().formatNumber(pro_anual) %></td><td class="edit uilib-enability uilib-show-role-administrador uilib-show-role-tecnico"><i class="fa fa-pencil-square-o"></i></td><td class="delete uilib-enability uilib-show-role-administrador uilib-show-role-tecnico"><i class="fa fa-trash"></i></td>',
                collectionModel: Backbone.SIXHIARA.TanquePiscicola,
                domains: this.options.domains,
            });
            this.subViews.push(table);
        }

        return this;
    },

    remove: function() {
        Backbone.View.prototype.remove.call(this);
        _.invoke(this.subViews, "remove");
    },
});
