SIRHA.Utils.DOM = {
    /**
     * @param {String} HTML representing a single element
     * @return {Element}
     */
    htmlToElement: function htmlToElement(html) {
        var template = document.createElement("template");
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    },

    /**
     * @param {String} HTML representing any number of sibling elements
     * @return {NodeList}
     */
    htmlToElements: function htmlToElements(html) {
        var template = document.createElement("template");
        template.innerHTML = html;
        const childNodes = template.content.childNodes;
        /*
        When html is multiline string the result can introduce empty `text`
        nodes so we want to filter it
        */
        const sanitizedNodes = Array.from(childNodes).filter(n => n.innerHTML);
        return sanitizedNodes;
    },

    /**
    Disables a button or DOM Element acting as a button within bootstrap
    @param {String} id the element
    */
    disableBt: function disableBt(btName) {
        const bt = document.getElementById(btName);
        bt.classList.add("disabled");
        bt.setAttribute("aria-disabled", "true");
    },

    /**
    Enables a button or DOM Element acting as a button within bootstrap
    @param {String} id the element
    */
    enableBt: function(btName) {
        const bt = document.getElementById(btName);
        bt.classList.remove("disabled");
        bt.removeAttribute("aria-disabled");
    },

    allRequiredInputAreChecked: function(selector) {
        return Array.from(document.querySelectorAll(selector)).every(input => {
            if (input.required) {
                return input.checked;
            }
            return true;
        });
    },
};
