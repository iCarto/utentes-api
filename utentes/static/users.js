var users = new Backbone.SIXHIARA.UserCollection();

var domains = new Backbone.UILib.DomainCollection([
    {
        'category': 'groups',
        'text': null,
        'order': 0,
    },
    {
        'category': 'groups',
        'text': 'Administrador',
        'order': 1,
    },
    {
        'category': 'groups',
        'text':'D. Administrativo',
        'order': 2,
    },
    {
        'category': 'groups',
        'text':'Direcção',
        'order': 3,
    },
    {
        'category': 'groups',
        'text':'D. Financeiro',
        'order': 4,
    },
    {
        'category': 'groups',
        'text':'D. Jurídico',
        'order': 5,
    },
    {
        'category': 'groups',
        'text':'D. Técnico',
        'order': 6,
    },
]);



users.fetch({
    parse: true,
    success: function() {
        var table = new Backbone.SIXHIARA.EditableTableView({
            el: document.getElementById('section-users'),
            newRowBtSelector: '#newRow',
            modalSelectorTpl: '#user-edit',
            tableSelector: 'table',
            collection: users,
            rowTemplate: '</td><td><%- username %></td><td><%- usergroup %></td><td class="edit uilib-enability uilib-show-role-administrador uilib-show-role-tecnico"><i class="fa fa-pencil-square-o"></i></td><td class="delete uilib-enability uilib-show-role-administrador uilib-show-role-tecnico"><i class="fa fa-trash"></i></td>',
            collectionModel: Backbone.SIXHIARA.User,
            domains: domains,
            deleteFromServer: true,
        });
    }
});
