Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.RowFonteView = Backbone.View.extend({
    tagName: "tr",

    template: _.template(`
        <td><%- tipo_agua %></td>
        <td><%- tipo_fonte %></td>
        <td><% print(formatter().formatNumber(c_soli)) %></td>
        <td><%- observacio %></td>
        <td class="delete"><i class="fas fa-trash-alt"></i></td>
    `),

    render: function() {
        this.$el.append(this.template(this.model.toJSON()));
        new Backbone.SIXHIARA.RowDeleteButtonView({
            model: this.model,
            el: this.$(".delete"),
            question: "Tem certeza de que deseja excluir",
        });

        return this;
    },
});
