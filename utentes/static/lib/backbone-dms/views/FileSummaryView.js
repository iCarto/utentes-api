Backbone.DMS = Backbone.DMS || {};
Backbone.DMS.FileSummaryView = Backbone.View.extend({
    tagName: 'tr',

    events: {
        'click #delete-button': 'deleteFile',
    },

    template: _.template(
        '<td class="type"><i class="fa fa-file"></i></td>' +
        '<td class="name"><a id="download-button" href="<%=data.url%>" target="_blank"><%=data.name%></a></td>' +
        '<td class="size"><%=formatBytes(data.size, 2)%></td>' +
        '<td class="actions"></td>'
    ),

    templateDownloadButton: _.template(
        '<a id="download-button" href="<%=data.url%>" target="_blank"><i class="fa fa-download"></i></a>'
    ),

    templateDeleteButton: _.template(
        '<a id="delete-button" href="#"><i class="fa fa-trash"></i></a>'
    ),

    initialize: function(){
        _.bindAll(this, 'deleteFile');
        this.model.set('id', this.model.get('name'))
        this.render();
    },

    render: function(){
        this.$el.html(this.template({
            data: this.model.toJSON(),
            formatBytes: this.formatBytes
        }));
        this.showDownloadButton();
        this.showDeleteButton();
        return this;
    },

    showDownloadButton: function() {
        if(_.contains(this.model.get('permissions'), PERMISSION_DOWNLOAD)) {
            this.$el.children('.actions').append(this.templateDownloadButton({
                data: this.model.toJSON()
            }));
        }
    },

    showDeleteButton: function() {
        if(_.contains(this.model.get('permissions'), PERMISSION_DELETE)) {
            this.$el.children('.actions').append(this.templateDeleteButton());
        }
    },

    deleteFile: function() {
        bootbox.confirm('Se você aceitar, o documento é eliminado', result => {
            if (result) {
                this.model.destroy({
                    error: function(xhr, textStatus, errorThrown) {
                        bootbox.alert(textStatus.responseJSON.error);
                    }
                });
            }
        });
    },

    formatBytes: function(bytes,decimals) {
        if(bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals <= 0 ? 0 : decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

});
