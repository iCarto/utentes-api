Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.NumberOfResultsView = Backbone.View.extend({

    events: {
    },

    initialize: function(options) {
        this.options = options || {};
        this.totalResults = options.totalResults;
        this.render(this.totalResults);
    },

    render: function(size) {
        if(!size) {
            size = 0;
        }
        this.$el.html('(<span class="filtered">' + size + '</span> de ' + this.totalResults + ')');
    },

    update: function(size){
        this.render(size);
    },
});
