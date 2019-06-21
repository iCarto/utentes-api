Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.TabBarTitle = Backbone.View.extend({
    initialize: function(options) {
        this.options = options || {};
    },

    render: function() {
        fragment = document.createDocumentFragment();
        this.li = document.createElement("li");
        var a = document.createElement("a");
        a.textContent = this.model;
        this.li.appendChild(a);
        this.li.style.float = "right";
        fragment.appendChild(this.li);
        this.el.appendChild(fragment);
        return this;
    },

    remove: function() {
        this.li.remove();
    },
});
