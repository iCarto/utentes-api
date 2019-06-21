Backbone.UILib = Backbone.UILib || {};
Backbone.UILib.WidgetsView = Backbone.View.extend({
    // events to update model when widget value changes
    events: {
        "input  .widget": "updateText",
        "input  .widget-number": "updateNumber",
        "input  .widget-date": "updateDate",
        "change .widget": "updateFromOptions",
        "change .widget-boolean": "updateFromOptionsBoolean",
    },

    displayNull: function(name) {
        // having the name property available would let developers hack this method
        // in custom ways. For example:
        //
        // var view = new Backbone.UILib.WidgetsView({
        //   el:    HTMLElement,
        //   model: BackboneModel,
        // });
        // view.displayNull = function(name){
        //   if(name === 'myName') return 'my custom null';
        //   return '-';
        // };
        // view.render();

        return "";
    },

    render: function() {
        var app = this;
        var f = formatter();

        this.$("span.widget-date").each(function(index, widget) {
            widget.textContent =
                f.formatDate(app.model.get(widget.id)) || app.displayNull(widget.id);
        });

        this.$("span.widget-number").each(function(index, widget) {
            widget.textContent =
                f.formatNumber(app.model.get(widget.id)) || app.displayNull(widget.id);
        });

        this.$("span.widget").each(function(index, widget) {
            widget.textContent = app.model.get(widget.id) || app.displayNull(widget.id);
        });

        this.$("input:checkbox.widget").each(function(index, widget) {
            widget.removeAttribute("checked");
            if (app.model.get(widget.id)) {
                widget.setAttribute("checked", true);
            }
        });

        this.$("input:text.widget").each(function(index, widget) {
            widget.value = app.model.get(widget.id);
        });

        this.$("input:text.widget-number").each(function(index, widget) {
            widget.value = f.formatNumber(app.model.get(widget.id), "0[.]00");
        });

        this.$("input:text.widget-date").each(function(index, widget) {
            widget.value = f.formatDate(app.model.get(widget.id));
        });

        this.$("textarea.widget").each(function(index, widget) {
            widget.value = app.model.get(widget.id);
        });

        this.$("select.widget").each(function(index, widget) {
            $(widget)
                .find("option:selected")
                .removeAttr("selected");
            $(widget.options).each(function(index, option) {
                if (app.model.get(widget.id) === option.text) {
                    $(option).attr("selected", "selected");
                }
            });
        });

        this.$("select.widget-boolean").each(function(index, widget) {
            $(widget)
                .find("option:selected")
                .removeAttr("selected");
            $(widget.options).each(function(index, option) {
                // posible values for a boolean are:
                // * true  which would become 'true'
                // * false which would become 'false'
                // * null  which would become 'null'
                var widgetVal = app.model.get(widget.id) + "";
                // and for a component like <option></option>
                // * option.text  is ''
                // * option.value is ''
                // so we need to convert 'null' to ''
                if (widgetVal === "null") widgetVal = "";
                if (widgetVal === option.value) {
                    $(option).attr("selected", "selected");
                }
            });
        });

        return this;
    },

    updateText: function(e) {
        var attr = e.target.id;
        var widget = this.$el.find("#" + attr);
        var value = widget.val();
        if (value != null) {
            value = widget.val().trim() || null;
        }
        this.model.set(attr, value);
    },

    updateNumber: function(e) {
        var attr = e.target.id;
        var widget = this.$el.find("#" + attr);
        var value = formatter().unformatNumber(widget.val());
        this.model.set(attr, value);
    },

    updateDate: function(e) {
        var attr = e.target.id;
        var widget = this.$el.find("#" + attr);
        var value = formatter().unformatDate(widget.val());
        this.model.set(attr, value);
    },

    updateFromOptions: function(e) {
        var attr = e.target.id;
        var widget = this.$el.find("#" + attr);
        if (widget.is(":checkbox")) {
            var value = widget.is(":checked");
            this.model.set(attr, value);
        } else if (widget.is("select")) {
            // this would take the text of the option, not its value
            //
            // ie:
            // <select id="example">
            // <option value="1">Some text</option>
            // </select>
            //
            // model.get('example') would return "Some text", not "1"
            var widgetSelected = this.$el.find("#" + attr + " option:selected");
            var value = widgetSelected.text().trim() || null;
            this.model.set(attr, value);
        }
    },

    updateFromOptionsBoolean: function(e) {
        var attr = e.target.id;
        var widget = this.$el.find("#" + attr);
        // TODO: implement for checkboxes
        if (widget.is("select")) {
            // this would take the value of the option as boolean, not its text
            //
            // ie:
            // <select id="example">
            // <option value="true">Some text</option>
            // </select>
            //
            // model.get('example') would return true as boolean, not "Some text"
            var widgetSelected = this.$el.find("#" + attr + " option:selected");
            var value = null;
            if (widgetSelected.val() === "true") value = true;
            if (widgetSelected.val() === "false") value = false;
            this.model.set(attr, value);
        }
    },
});
