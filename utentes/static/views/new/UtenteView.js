Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.UtenteView = Backbone.View.extend({
    initialize: function(options) {
        this.options = options || {};
        this.render();
    },

    render: function render() {
        this.fillSelectUtente();
    },

    fillSelectUtente: function fillSelectUtente() {
        new Backbone.SIXHIARA.SelectUtenteView({
            el: $("#utente"),
            collection: this.collection,
        }).render();
    },
});
