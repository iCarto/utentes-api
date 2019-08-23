var users = new Backbone.SIXHIARA.UserCollection();

users.fetch({
    parse: true,
    success: function() {
        var table = new Backbone.SIXHIARA.EditableTableView({
            el: document.getElementById("section-users"),
            newRowBtSelector: "#newRow",
            modalSelectorTpl: "#user-edit",
            tableSelector: "table",
            collection: users,
            rowTemplate:
                '</td><td><%- username %></td><td><%- usergroup %></td><td><%- unidade || "" %></td><td class="edit uilib-enability uilib-show-role-administrador uilib-show-role-tecnico"><i class="fas fa-edit"></i></td><td class="delete uilib-enability uilib-show-role-administrador uilib-show-role-tecnico"><i class="fas fa-trash-alt"></i></td>',
            collectionModel: Backbone.SIXHIARA.User,
            domains: role_domains_collection,
            deleteFromServer: true,
        });
    },
});
