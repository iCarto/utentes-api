(function() {

/*
 * Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
 * Contributors: Mike Grier (mgrier.com), Clint Priest, Kyle Adams, guillermo
 * See: http://js-naturalsort.googlecode.com/svn/trunk/naturalSort.js
 */
function localeSort (a, b, html) {

    var htmre = /(<([^>]+)>)/ig,
        x = a.toString().replace(htmre, '') || '',
        y = b.toString().replace(htmre, '') || '';

    return x.localeCompare(y, 'pt', {sensitivity: 'base'});
}

jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "localesort-asc": function ( a, b ) {
        return localeSort(a,b,true);
    },

    "localesort-desc": function ( a, b ) {
        return localeSort(a,b,true) * -1;
    },

} );

}());
