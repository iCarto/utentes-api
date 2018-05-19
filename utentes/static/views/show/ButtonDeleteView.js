Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.ButtonDeleteView = Backbone.View.extend({

    events: {
        "click": "doClick"
    },

    doClick: function(){
        bootbox.confirm('Se você aceitar a exploração é excluída', result => {
            if (result) {
                this.model.destroy({
                    // wait: true,
                    success: function(model, resp, options) {
                        window.location = Backbone.SIXHIARA.Config.urlSearch;
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        bootbox.alert(textStatus.statusText);
                    }
                });
            }
        });
    },

});
