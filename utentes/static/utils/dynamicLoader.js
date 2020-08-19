// https://usefulangle.com/post/102/javascript-loading-css-files
// https://stackoverflow.com/questions/574944/how-to-load-up-css-files-using-javascript
// https://code-boxx.com/dynamically-load-javascript-css/
// https://usefulangle.com/post/101/javascript-load-js-file-dynamic
// https://stackoverflow.com/a/10939737/930271
// https://api.jquery.com/jQuery.getScript/
// https://developer.mozilla.org/de/docs/Web/API/HTMLScriptElement#Dynamically_importing_scripts
// https://stackoverflow.com/questions/34638221/load-jquery-with-javascript-using-promises

SIRHA.Utils.dynamicLoader = {
    addCSS: function addCSS(filename) {
        // (filename, onload, onerror)
        // $('head').append('<link rel="stylesheet" type="text/css" href="style.css">');
        if (document.getElementById(filename)) {
            return Promise.resolve();
        }

        return new Promise(function(resolve, reject) {
            var tag = document.createElement("link");
            tag.id = filename;
            tag.href = filename;
            tag.type = "text/css";
            tag.rel = "stylesheet";
            tag.media = "all";
            tag.onload = resolve;
            tag.onerror = reject;

            // tag.onload =
            //     onload ||
            //     function() {
            //         console.log("loaded: " + filename);
            //     };
            //
            // tag.onerror =
            //     onerror ||
            //     function() {
            //         console.log("error");
            //     };
            document.head.appendChild(tag);
        });
    },

    isCSSLoaded: function loadedCSS(filename) {
        // var linkEl = document.head.querySelector(`link[href*="${filename}"]`);
        // return Boolean(linkEl.sheet);

        var links = document.getElementsByTagName("link");
        for (var i = 0; i < links.length; i++) {
            if (links[i].href === filename) {
                return true;
            }
        }
        return false;
    },

    addScript: function addScript(filename, onload) {
        if (document.getElementById(filename)) {
            return Promise.resolve();
        }

        return new Promise(function(resolve, reject) {
            var tag = document.createElement("script");
            tag.id = filename;
            tag.src = filename;
            tag.type = "text/javascript";
            tag.onload = resolve;
            tag.onerror = reject;
            document.body.appendChild(tag);
        });

        // document.getElementsByTagName("head")[0].appendChild(tag);

        // var first = document.getElementsByTagName("script")[0];
        // first.parentNode.insertBefore(tag, first);
    },

    /*
    // say.js = export export function hi() {alert(`Hello`)};
}
    var aaa = loader.addModule("/static/say.js")
    var bbb = undefined;
    aaa.then((d) => {bbb = d});
    bbb.hi()
    */
    addModule: async function addModule(filename, onload) {
        // https://javascript.info/modules-dynamic-imports
        const m = await import(filename);
        onload && onload(m);
        return m;
    },
};
