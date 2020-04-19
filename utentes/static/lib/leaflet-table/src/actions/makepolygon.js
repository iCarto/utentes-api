var MakePolygon = L.Toolbar2.Action.extend({
    options: {
        toolbarIcon: {
            html: '<i class="fas fa-square"></i>',
            tooltip: "Críar polígono",
        },
    },

    addHooks: function() {
        var polygon = table.makePolygon();
        // TODO how a toolbar action may have access to the map?
        // if(polygon.getBounds().isValid()){
        //   map.fitBounds(polygon.getBounds()).setMaxBounds(geoJsonLayer.getBounds().pad(0.5));
        // }
    },
});
