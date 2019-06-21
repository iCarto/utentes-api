Backbone.SIXHIARA = Backbone.SIXHIARA || {};
Backbone.SIXHIARA.DocxGeneratorView = Backbone.View.extend({
    initialize: function(options) {
        this.options = options || {};
        var data = this.options.data;

        var self = this;
        JSZipUtils.getBinaryContent(data.urlTemplate, function(error, template) {
            if (error) {
                throw error;
            }

            docxTemplates({
                template,
                data,
                cmdDelimiter: "***",
                additionalJsContext: {
                    // Creates a base64 string with the image data
                    imageGenerator: function(url, width, height, outputFormat) {
                        return new Promise(function(resolve) {
                            var image = new Image(width, height);
                            image.extension = ".png";
                            image.onload = function() {
                                var canvas = document.createElement("CANVAS");
                                var ctx = canvas.getContext("2d");
                                canvas.height = this.naturalHeight;
                                canvas.width = this.naturalWidth;
                                ctx.drawImage(this, 0, 0);
                                var dataUrl = canvas.toDataURL(outputFormat);
                                image.data = dataUrl.slice(
                                    "data:image/png;base64,".length
                                );
                                resolve(image);
                            };
                            image.src = url;
                        });
                    },
                },
            }).then(function(report) {
                self.saveDataToFile(report, data.nameFile);
            });
        });
    },

    saveDataToFile: function(data, fileName) {
        const blob = new Blob([data], {
            type:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        const url = window.URL.createObjectURL(blob);
        this.downloadURL(url, fileName);
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
        }, 1000);
    },

    downloadURL: function(data, fileName) {
        const a = document.createElement("a");
        a.href = data;
        a.download = fileName;
        document.body.appendChild(a);
        a.style = "display: none";
        a.click();
        a.remove();
    },
});
