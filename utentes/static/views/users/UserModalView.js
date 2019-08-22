Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.UserModalView = Backbone.UILib.ModalView.extend({
    customConfiguration: function() {
        var self = this;
        var domains = new Backbone.UILib.DomainCollection();
        domains.fetch({
            success: function(collection, response, options) {
                new Backbone.UILib.SelectView({
                    el: self.$("#usergroup"),
                    collection: self.options.domains.byCategory("groups"),
                }).render();

                new Backbone.UILib.SelectView({
                    el: self.$("#unidade"),
                    collection: collection.byCategory("unidade"),
                }).render();

                if (self.model.get("usergroup") == SIRHA.ROLE.UNIDAD) {
                    self.$("#unidade-form").removeClass("hidden");
                }

                new Backbone.UILib.PasswordView({
                    el: document.getElementById("password-view"),
                    model: this.model,
                    required: !self.options.editing,
                }).render();

                document.getElementById("usergroup").addEventListener(
                    "change",
                    function(e) {
                        document.getElementById("unidade").selectedIndex = 0;
                        self.model.set("unidade", null);
                        var selected = this.options[this.options.selectedIndex].text;
                        if (selected == SIRHA.ROLE.UNIDAD) {
                            self.$("#unidade-form").removeClass("hidden");
                        } else {
                            self.$("#unidade-form").addClass("hidden");
                        }
                    },
                    this
                );

                document.getElementById("unidade").addEventListener(
                    "change",
                    function(e) {
                        self.checkIfUnidadWidgetIsValid();
                    },
                    this
                );

                self.fillSelects();
            },
            error: function() {
                bootbox.alert(
                    '<span style="color: red;">Produziu-se um erro. Informe ao administrador.</strong>'
                );
            },
        });
    },

    okButtonClicked: function() {
        if (this.isSomeWidgetInvalid()) return;
        if (this.options.editing) {
            var widgets = this.$(".modal").find(
                ".widget, .widget-number, .widget-date, .widget-boolean, .widget-external"
            );
            var widgetsId = _.map(widgets, function(w) {
                return w.id;
            });
            var attrs = this.widgetModel.pick(widgetsId);
            this.model.set(attrs);
        } else {
            this.collection.add(this.model);
        }

        if (this.options.deleteFromServer) {
            this.model.save(null, {
                wait: true,
                success: function() {
                    console.log("Ok");
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
        }
        this.$(".modal").modal("hide");
    },

    fillSelects: function() {
        var self = this;
        this.$("select.widget").each(function(index, widget) {
            $(widget)
                .find("option:selected")
                .removeAttr("selected");
            $(widget.options).each(function(index, option) {
                if (self.model.get(widget.id) === option.text) {
                    $(option).attr("selected", "selected");
                }
            });
        });
    },

    isSomeWidgetInvalid: function() {
        this.checkIfUnidadWidgetIsValid();
        return Backbone.UILib.ModalView.prototype.isSomeWidgetInvalid.call(this);
    },

    checkIfUnidadWidgetIsValid: function() {
        var unidadeSelect = document.getElementById("unidade");
        var unidadeSelectHelpBlock = document.getElementById("helpBlock_unidade");

        if (this.$("#unidade").is(":visible") && !this.$("#unidade").val()) {
            var errorMsg =
                'O campo "Unidade" é obrigatório para o tipo de usuário "Unidade ou Delegação"';
            unidadeSelect.setCustomValidity(errorMsg);
            unidadeSelectHelpBlock.innerHTML = errorMsg;
            unidadeSelectHelpBlock.style.display = "block";
        } else {
            unidadeSelect.setCustomValidity("");
            unidadeSelectHelpBlock.innerHTML = "";
            unidadeSelectHelpBlock.style.display = "none";
        }
    },
});
