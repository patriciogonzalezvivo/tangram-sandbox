/*
Copyright (c) 2014 Harish Krishna

This plugin adds a bunch of custom styles to your leaflet map as a drop down menu L.Control
*/
L.Control.Search = L.Control.extend({
    options: {
        position: 'topleft',
        icon: 'glyphicon-search glyphicon',
        strings: {
            title: "Show me how to search"
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
        
        L.DomEvent
            .on(this._link, 'click', L.DomEvent.stopPropagation)
            .on(this._link, 'click', L.DomEvent.preventDefault)
            .on(this._link, 'click', function() {
                if (!self._show) {
                    L.DomUtil.addClasses(self._container, "selected");
                    self._show = true;  
                } else {
                    L.DomUtil.removeClasses(self._container, "selected");
                    self._show = false;
                }
                $("#searchbar").toggle();
            })
            .on(this._link, 'dblclick', L.DomEvent.stopPropagation);

        return container;
    }
});

L.control.search = function (options) {
    return new L.Control.Search(options);
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