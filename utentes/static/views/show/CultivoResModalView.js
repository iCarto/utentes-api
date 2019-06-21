Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.CultivoResModalView = Backbone.SIXHIARA.ModalView.extend({
    customConfiguration: function() {
        new Backbone.UILib.SelectView({
            el: this.$("#reses_tipo"),
            collection: this.options.domains.byCategory("animal_tipo"),
        }).render();

        new Backbone.UILib.SelectView({
            el: this.$("#cultivo"),
            collection: this.options.domains.byCategory("cultivo_tipo"),
        }).render();

        new Backbone.UILib.SelectView({
            el: this.$("#rega"),
            collection: this.options.domains.byCategory("rega_tipo"),
        }).render();

        this.listenTo(this.widgetModel, "change:rega", function() {
            var efi = this.widgetModel.eficienciaByRega();
            var efiWidget = this.$(".modal").find("#eficiencia");
            if (!efi) {
                efiWidget.prop("disabled", true);
                efiWidget.val(null);
            } else {
                efiWidget.prop("disabled", false);
                efiWidget.val(formatter().formatNumber(efi));
            }
        });

        this.$(".modal")
            .find("#eficiencia")
            .prop("disabled", _.isNull(this.widgetModel.get("eficiencia")));
    },

    okButtonClicked: function() {
        if (this.isSomeWidgetInvalid()) return;
        Backbone.SIXHIARA.ModalView.prototype.okButtonClicked.call(this);
    },

    isSomeWidgetInvalid: function() {
        // we only use Constraint API with input elements, so check only those
        var widgets = this.$(".modal").find(
            "input.widget, input.widget-number, input.widget-date, select.widget"
        );
        var someInvalid = false;
        widgets.each(function(index, widget) {
            if (!widget.validity.valid) {
                someInvalid = true;
            }
        });
        return someInvalid;
    },
});
