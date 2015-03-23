/*
Copyright (c) 2014 Harish Krishna

This plugin adds a bunch of custom locations to your leaflet map as a drop down menu L.Control
(Useful, if you want to jump from one location to another to lets say test a geocoder within map bounds) 
*/
L.Control.Locations = L.Control.extend({
    options: {
        position: 'topleft',
        icon: 'glyphicon-th-list glyphicon',
        locations: [
            {'loc': [51.505, -0.124], 'zoom': 12, 'name': 'London'},
            {'loc': [40.7259253, -73.9805603], 'zoom': 12, 'name': 'New York'},
            {'loc': [48.858864, 2.346986], 'zoom': 12, 'name': 'Paris'},
            {'loc': [40.4127118, -3.7034225], 'zoom': 12, 'name': 'Madrid'},
            {'loc': [28.6457035, 77.2356033], 'zoom': 12, 'name': 'Delhi'},
            {'loc': [-37.8171749, 144.9632263], 'zoom': 14, 'name': 'Melbourne'},
            {'loc': [-41.2903189, 174.7790909], 'zoom': 15, 'name': 'Wellington'}
        ],
        strings: {
            title: "Show me other locations"
        }
    },

    initialize: function (options) {
        for (var i in options) {
            if (typeof this.options[i] === 'object') {
                L.extend(this.options[i], options[i]);
            } else {
                this.options[i] = options[i];
            }
        }
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div',
            'leaflet-control-locations leaflet-bar leaflet-control');

        var self = this;
        this._layer = new L.LayerGroup();
        this._layer.addTo(map);

        this._container = container;

        this._link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', container);
        this._link.href = '#';
        this._link.title = this.options.strings.title;
        this._icon = L.DomUtil.create('i', this.options.icon, this._link);
        this._list = L.DomUtil.create('ul', 'locations shortcuts hidden', container);
        
        for (var i=0; i<this.options.locations.length; i++) {
            var $this = this.options.locations[i];
            var li = L.DomUtil.create('li', '', this._list);
            var link = L.DomUtil.create('a', '', li);
            link.setAttribute('data-loc', $this.loc);
            link.setAttribute('data-zoom', $this.zoom);
            link.innerHTML = $this.name;
            L.DomEvent
                .on(link, 'click', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.preventDefault)
                .on(link, 'click', function() {
                    var loc = this.getAttribute('data-loc').split(",");
                    var zoom = this.getAttribute('data-zoom');
                    map.setView([Number(loc[0]).toFixed(7), Number(loc[1]).toFixed(7)], zoom);
                })
        }

        L.DomEvent
            .on(this._link, 'click', L.DomEvent.stopPropagation)
            .on(this._link, 'click', L.DomEvent.preventDefault)
            .on(this._link, 'click', function() {
                if (!self._show) {
                    L.DomUtil.addClasses(self._container, "expanded");
                    L.DomUtil.removeClasses(self._list, "hidden");
                    self._show = true;  
                } else {
                    L.DomUtil.removeClasses(self._container, "expanded");
                    L.DomUtil.addClasses(self._list, "hidden");
                    self._show = false;
                }
                
            })
            .on(this._link, 'dblclick', L.DomEvent.stopPropagation);

        return container;
    }
});

L.control.locations = function (options) {
    return new L.Control.Locations(options);
};

(function(){
  // code borrowed from https://github.com/domoritz/leaflet-locatecontrol (thank you Dominik Moritz)
  // leaflet.js raises bug when trying to addClass / removeClass multiple classes at once
  // Let's create a wrapper on it which fixes it.
  var LDomUtilApplyClassesMethod = function(method, element, classNames) {
    classNames = classNames.split(' ');
    classNames.forEach(function(className) {
        L.DomUtil[method].call(this, element, className);
    });
  };

  L.DomUtil.addClasses = function(el, names) { LDomUtilApplyClassesMethod('addClass', el, names); };
  L.DomUtil.removeClasses = function(el, names) { LDomUtilApplyClassesMethod('removeClass', el, names); };
})();