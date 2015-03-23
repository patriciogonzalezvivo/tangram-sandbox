/*
Copyright (c) 2014 Harish Krishna

This plugin adds a bunch of custom styles to your leaflet map as a drop down menu L.Control
*/
L.Control.Styles = L.Control.extend({
    options: {
        position: 'topleft',
        icon: 'glyphicon-picture glyphicon',
        styles: [
            {'style_file': './styles/default.yaml', 'name': 'default'},
            {'style_file': './styles/lego.yaml', 'name': 'lego'},
            {'style_file': './styles/patterns.yaml', 'name': 'patterns'},
            {'style_file': './styles/sandbox.yaml', 'name': 'sandbox'},
            {'style_file': './styles/tron.yaml', 'name': 'tron'},
            {'style_file': './styles/wallpaper.yaml', 'name': 'wallpaper'},
            {'style_file': './styles/zebra.yaml', 'name': 'zebra'}
        ],
        strings: {
            title: "Show me other map styles"
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
        
        for (var i=0; i<this.options.styles.length; i++) {
            var $this = this.options.styles[i];
            var li = L.DomUtil.create('li', '', this._list);
            var link = L.DomUtil.create('a', '', li);
            link.setAttribute('data-style_file', $this.style_file);
            link.setAttribute('data-style_name', $this.name);
            link.innerHTML = $this.name;
            L.DomEvent
                .on(link, 'click', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.preventDefault)
                .on(link, 'click', function() {
                    var style_name = this.getAttribute('data-style_name');
                    var style_file = this.getAttribute('data-style_file');
                    // var layer = Tangram.leafletLayer({
                    //     scene: style_file,
                    //     attribution: 'Map data &copy; OpenStreetMap contributors | <a href="https://github.com/tangrams/tangram" target="_blank">Source Code</a>'
                    // });

                    // map.removeLayer(window.layer)
                    // window.layer = layer;
                    // var scene = layer.scene;
                    // window.scene = scene;
                    // layer.addTo(window.map);
                    $(document).trigger({
                      'type': "pelias:new-style",
                      'style': style_name,
                      'file' : style_file
                    });
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

L.control.styles = function (options) {
    return new L.Control.Styles(options);
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