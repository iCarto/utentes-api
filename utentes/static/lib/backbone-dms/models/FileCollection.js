Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FileCollection = Backbone.Collection.extend({

    model: Backbone.DMS.File,

    //Override for parsing backend model to frontend model
    parse : function(filesResponse) {
        var files = [];
        for(var i = 0; i < filesResponse.length; i++) {
            files.push(
                new Backbone.DMS.File({
                    'name': filesResponse[i].name,
                    'type': filesResponse[i].type,
                    'size': filesResponse[i].size,
                    'url': filesResponse[i].url,
                    'created_at': filesResponse[i].created_at
                })
            );
        }
        return files;
    },

});
