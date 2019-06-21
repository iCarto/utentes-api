/*
This file should be loaded after any third party library, backbone, moment,
datatables, ... and before any of our libraries or js files

It monkey patches core and third party objects
*/

Backbone.Model.prototype.dateFields = [];
Backbone.Model.prototype.parse = function(resp, options) {
    /*
    Child classes that overide this method must use:
    CHILD_CLASS_NAME.__super__.parse.call(this, resp, options);
    https://stackoverflow.com/questions/8596861/super-in-backbone
    https://stackoverflow.com/questions/8970606/accessing-parent-class-in-backbone
    https://content.pivotal.io/blog/a-convenient-super-method-for-backbone-js
    https://github.com/jashkenas/backbone/issues/785
    https://makandracards.com/makandra/22121-how-to-call-overwritten-methods-of-parent-classes-in-backbone-js
    Take care: `this.constructor.__super__` does not work when there is more
    than one level in the hierarchy
    */
    return _.mapObject(
        resp,
        function(value, key) {
            if (value && this.dateFields.includes(key)) {
                var sTokens = value.split("-");
                return new Date(Date.UTC(sTokens[0], sTokens[1] - 1, sTokens[2]));
            }
            return value;
        },
        this
    );
};

Backbone.Model.prototype.toJSON = function(options) {
    var attrs = _.clone(this.attributes);
    return _.mapObject(
        attrs,
        function(value, key) {
            if (value && this.dateFields.includes(key)) {
                return value.toISOString().substring(0, 10);
            }
            return value;
        },
        this
    );
};
