Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SelectYearView = Backbone.UILib.BaseView.extend({
    tagName: "select",

    template: _.template(
        '<option value=""></option>' +
            "<% _.each(years, function(year) { %>" +
            '<option value="<%= year %>"><%= year %></option>' +
            "<% }); %>"
    ),

    initialize: function() {
        this.years = [];
    },

    render: function() {
        this.$el.html(
            this.template({
                years: this.years,
            })
        );
        return this;
    },

    update: function(years) {
        this.years = years;
        this.render();
    },

    setSelected: function(yearSelected) {
        this.$el.val(yearSelected);
    },

    getSelected: function() {
        return this.$el.val();
    },

    hasSelected: function() {
        return this.$el.val() && this.$el.val() != "";
    },
});

Backbone.SIXHIARA.FilterYearsView = Backbone.UILib.BaseView.extend({
    initialize: function(options) {
        Backbone.UILib.BaseView.prototype.initialize.call(this);
        _.bindAll(this, "yearInitChange");

        this.years = options.years;

        this.selectYearInit = new Backbone.SIXHIARA.SelectYearView({
            el: this.$("#ano_inicio"),
            years: this.years,
        });
        this.addView(this.selectYearInit);
        this.selectYearInit.listenTo(
            this.model,
            "change:ano_inicio",
            this.yearInitChange
        );

        this.selectYearEnd = new Backbone.SIXHIARA.SelectYearView({
            el: this.$("#ano_fim"),
            years: this.years,
        });
        this.addView(this.selectYearEnd);
    },

    update: function(years) {
        this.selectYearInit.update(years);
        this.selectYearEnd.update(years);
    },

    yearInitChange: function(model, value, options) {
        if (!this.selectYearInit.hasSelected()) {
            this.selectYearEnd.setSelected(null);
            model.set("ano_fim", null);
        } else if (!this.selectYearEnd.hasSelected()) {
            this.selectYearEnd.setSelected(this.selectYearInit.getSelected());
            model.set("ano_fim", this.selectYearInit.getSelected());
        }
    },
});
