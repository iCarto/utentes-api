Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FolderCollection = Backbone.Collection.extend({
    model: Backbone.DMS.Folder,

    //Override for parsing backend model to frontend model
    parse: function(foldersResponse) {
        var files = [];
        for (var i = 0; i < foldersResponse.length; i++) {
            files.push(
                new Backbone.DMS.File({
                    id: foldersResponse[i].id,
                    name: foldersResponse[i].name,
                    type: foldersResponse[i].type,
                    size: foldersResponse[i].size,
                    url: foldersResponse[i].url,
                    date: new Date(foldersResponse[i].date),
                    permissions: foldersResponse[i].permissions,
                })
            );
        }
        return files;
    },
});
