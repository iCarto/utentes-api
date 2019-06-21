Backbone.UILib = Backbone.UILib || {};
Backbone.UILib.PasswordView = Backbone.View.extend({
    template: `
        <div class="form-group">
            <label for="password">Senha</label>
            <input type="password" class="form-control widget" id="password">
            <div style="display: flex; align-items: center; justify-content: flex-end; margin-top:5px; font-size: 0.9em;">
                Mostrar senha&nbsp;
                <input type="checkbox" id="mostrar-senha-check" style="margin: 0px;">
            </div>
        </div>
    `,

    events: {
        "click #mostrar-senha-check": "toggle",
    },

    initialize: function(options) {
        this.options = options || {};
    },

    render: function() {
        this.$el.html(this.template);
        this.setRequired(this.options.required);
        return this;
    },

    setRequired: function(required) {
        this.$el.find("#password").attr("required", required);
    },

    toggle: function() {
        var input = this.$el.find("#password");
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    },
});
