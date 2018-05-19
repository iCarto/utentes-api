Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.SelectActividadeView = Backbone.View.extend({

    events: {
        'change': 'updateActivity'
    },

    initialize: function(options) {
        this.options = options || {};
        var self = this;
        this.model.on('sync', function(){
            if (self.model.getActividadeTipo() !== Backbone.SIXHIARA.MSG.NO_ACTIVITY) {
                self.$('option:selected').removeAttr('selected');
                self.$('option').each(function(index, option) {
                    if (option.text === self.model.getActividadeTipo()) {
                        $(option).attr('selected', 'selected');
                    }
                });
            }
        });
    },

    updateActivity: function(e){
        var attr = e.target.id;
        var widget = this.$('#' + attr);
        // this would take the text of the option, not its value
        //
        // ie:
        // <select id="example">
        // <option value="1">Some text</option>
        // </select>
        //
        // model.get('example') would return "Some text", not "1"
        var widgetSelected = this.$('#' + attr + ' option:selected');
        var value = widgetSelected.text().trim() || Backbone.SIXHIARA.MSG.NO_ACTIVITY;
        this.model.set(attr, new Backbone.SIXHIARA.ActividadesFactory[value]());
    },

});
