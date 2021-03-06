var user = new Backbone.SIXHIARA.User();

var id = document.getElementById("userid").innerHTML;
user.set("id", id);
user.fetch({
    parse: true,
    success: function() {
        new Backbone.UILib.SelectView({
            el: this.$("#usergroup"),
            collection: role_domains_collection.byCategory("groups"),
        }).render();
        document.getElementById("usergroup").disabled = true;

        if (user.get("usergroup") == SIRHA.ROLE.UNIDAD) {
            new Backbone.UILib.SelectView({
                el: this.$("#unidade"),
                collection: new Backbone.Collection(
                    new Backbone.Model({text: user.get("unidade")})
                ),
            }).render();
            document.getElementById("unidade").disabled = true;
            this.$("#unidade-form").removeClass("hidden");
        }

        new Backbone.UILib.WidgetsView({
            el: document.getElementById("perfil_usuario"),
            model: user,
        }).render();

        new Backbone.UILib.PasswordView({
            el: document.getElementById("password-view"),
            model: user,
            required: false,
        }).render();

        document.getElementById("okButton").addEventListener("click", function() {
            user.save(null, {
                wait: true,
                success: function() {
                    alert("Senha mudada correctamente");
                },
                error: function(xhr, textStatus) {
                    if (
                        textStatus &&
                        textStatus.responseJSON &&
                        textStatus.responseJSON.error
                    ) {
                        if (Array.isArray(textStatus.responseJSON.error)) {
                            alert(textStatus.responseJSON.error.join("\n"));
                        } else {
                            alert(textStatus.responseJSON.error);
                        }
                    } else {
                        alert(textStatus.statusText);
                    }
                },
            });
        });
    },
});
