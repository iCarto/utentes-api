Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.CheckBoxList = Backbone.View.extend({

    events: {
        'click a': 'toggleAll',
        'change input[type=checkbox]': "toggle"
    },


    initialize: function(options) {
        if (options.domains) {
            this.options = {};
            this.options.domains = options.domains;
        }
        this.settings = $.extend({
            select_all: 'Todos',
            deselect_all: 'Ninguno',
            model_attr_name: 'items',
            domain_attr_name: null,
            render: false,
            toggleAllBtSel: null,
            enable_others: false,
        }, options);

        var items = this.model.get(this.settings.model_attr_name) || [];
        this.chbs = this.$('input[type="checkbox"]');
        _.each(this.chbs, function(chb) {
            var $chb = $(chb);
            $chb.prop('checked', items.indexOf($chb.val()) !== -1 );
        });

        if (this.settings.toggleAllBtSel) {
            this.bt = this.$('a');
            if (this.areAllChecked()) {
                this.bt.text(this.settings.deselect_all);
            } else {
                this.bt.text(this.settings.select_all);
            }
        }

        if (this.settings.enable_others) {
            var childId = this.settings.enable_others.childId;
            var child = this.$(`#${childId}`);
            var self = this;
            this.listenTo(this.model, `change:${this.settings.model_attr_name}`, function(model, value, options){
                if (value && value.indexOf(self.settings.enable_others.enabledValues) !== -1) {
                    child.prop("disabled", false);
                } else {
                    self.model.set(childId, null);
                    child[0].value = null;
                    child.prop("disabled", true);
                }
            });
            if (items && items.indexOf(self.settings.enable_others.enabledValues) !== -1) {
                child.prop("disabled", false);
            }
        }
    },

    // render: function() {
    //     if (!this.settings.render) {
    //         return this;
    //     }
    //     var modelKey = this.settings.model_attr_name;
    //     var domainKey = this.settings.domain_attr_name;
    //   // var elTipoAlim = this.$(`#${modelKey}`);
    //   var column = 0;
    //   this.options.domains.byCategory(domainKey).forEach(function(element) {
    //       var alias = element.get('alias');
    //       var text = element.get('text');
    //       var disabled = '';
    //     //   var other_possible_template = `<label class="checkbox">
    //     //     <input type="checkbox" name="estados" class="widget input-large" value="${s.alias}" ${disabled} />${s.estado}
    //     //     </label>`
    //     var $checkInputEl = $(`<div class="checkbox col-xs-4"><label><input type="checkbox" name="${modelKey}" value="${alias}" ${disabled}>${text}</label></div>`);
    //     this.$el.append($checkInputEl);
    //   }, this);
    //   return this;
    // },

    areAllChecked: function() {
        return this.chbs.filter(':checked').length === this.chbs.length
    },

    toggleAll: function(event) {
        event.preventDefault();
        if (this.areAllChecked()) {
            this.uncheckAll();
        } else {
            this.checkAll();
        }
    },

    toggle: function () {
        var checkedValues = this.getCheckedValues();
        this.model.set(this.settings.model_attr_name, checkedValues);
    },

    uncheckAll: function() {
        _.each(this.chbs, function(el) {
            $(el).prop('checked', false);
        });
        if (this.settings.toggleAllBtSel) {
            this.bt.text(this.settings.select_all);
        }

        this.toggle();
    },

    checkAll: function() {
        _.each(this.chbs, function(el) {
            $(el).prop('checked', true);
        });
        if (this.settings.toggleAllBtSel) {
            this.bt.text(this.settings.deselect_all);
        }

        this.toggle();
    },

    getCheckedValues: function() {
        var checkedValues = _.reduce(this.chbs, function(memo, chb) {
            var $chb = $(chb);
            if ($chb.prop('checked')) memo.push($chb.val());
            return memo;
        }, []);
        return checkedValues;
    },

  });
