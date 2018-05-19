var user = new Backbone.SIXHIARA.User();
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

var id = document.getElementById('userid').innerHTML;
user.set('id', id);
user.fetch({
    parse: true,
    success: function() {
        new Backbone.UILib.SelectView({
            el: this.$('#usergroup'),
            collection: domains.byCategory('groups'),
        }).render();
        document.getElementById('usergroup').disabled = true;
        new Backbone.UILib.WidgetsView({
            el: document.getElementById('perfil_usuario'),
            model: user,
        }).render();

        document.getElementById('okbutton').addEventListener('click', function(){
            user.save(null, {
                wait: true,
                success: function () {
                    alert('Senha mudada correctamente');
                },
                error: function (xhr, textStatus) {
                    if (textStatus && textStatus.responseJSON && textStatus.responseJSON.error) {
                        if(Array.isArray(textStatus.responseJSON.error)) {
                            alert(textStatus.responseJSON.error.join('\n'));
                        } else{
                            alert(textStatus.responseJSON.error);
                        }
                    } else {
                        alert(textStatus.statusText);
                    }
                },
            });
        });
    }
});
