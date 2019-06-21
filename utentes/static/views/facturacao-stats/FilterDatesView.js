Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.FilterMonthYearView = Backbone.View.extend({
    tagName: "div",
    className: "month-widget",

    template: _.template(`
        <label class="month-label"><%= title %></label>
        <select class="form-control month-select-widget">
            <option value=""></option>
            <% _.each(months, function(month) { %>
                <option value="<%= month %>"><%= month %></option>
            <% }); %>
        </select>
        <select class="form-control year-select-widget">
            <option value=""></option>
            <% _.each(years, function(year) { %>
                <option value="<%= year %>"><%= year %></option>
            <% }); %>
        </select>
    `),

    initialize: function(options) {
        this.options = options || {};
        this.months = [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
        ];
        var startYear = 2017;
        var year = new moment().get("years");
        this.years = [];
        while (startYear <= year) {
            this.years.push(year--);
        }
    },

    removeListeners: function() {
        this.$el.find(".month-select-widget").off("change");
        this.$el.find(".year-select-widget").off("change");
    },

    setListeners: function() {
        var self = this;
        this.$el.find(".month-select-widget").on("change", function() {
            self.model.set("mes_" + self.options.filter_field, this.value);
        });
        this.$el.find(".year-select-widget").on("change", function() {
            self.model.set("ano_" + self.options.filter_field, this.value);
        });
    },

    render: function() {
        this.removeListeners();
        this.$el.html(
            this.template({
                title: this.options.title,
                months: this.months,
                years: this.years,
            })
        );
        this.setListeners();
        return this;
    },

    update: function(years) {
        this.years = years;
        this.render();
    },
});

Backbone.SIXHIARA.FilterDatesView = Backbone.View.extend({
    tagName: "div",

    template: _.template(`
        <div id="mes_inicio"></div>
        <div id="mes_fim"></div>
    `),

    initialize: function(options) {
        this.selectMonthInit = new Backbone.SIXHIARA.FilterMonthYearView({
            filter_field: "inicio",
            title: "Mes Inicio",
            model: this.model,
        });
        this.selectMonthEnd = new Backbone.SIXHIARA.FilterMonthYearView({
            filter_field: "fim",
            title: "Mes Fim",
            model: this.model,
        });
    },

    render: function() {
        this.$el.html(this.template);
        this.$el.find("#mes_inicio").html(this.selectMonthInit.render().el);
        this.$el.find("#mes_fim").html(this.selectMonthEnd.render().el);
        return this;
    },
});
