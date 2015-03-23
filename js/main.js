var app = angular.module('pelias', []);
var hash_params = L.Hash.parseHash(location.hash);

var styles = {
  'default':'./styles/default',
  'lego':'./styles/lego',
  'patterns':'./styles/patterns',
  'sandbox':'./styles/sandbox',
  'tron':'./styles/tron',
  'wallpaper':'./styles/wallpaper'
  'zebra':'./styles/zebra'
}

function insertAfter(newElement,targetElement) {
  var parent = targetElement.parentNode;
  if (parent.lastChild == targetElement) {
      parent.appendChild(newElement);
  } else {
      parent.insertBefore(newElement,targetElement.nextSibling);
  }
}

function captionizeImages() {
  if (!document.getElementsByTagName) 
      return false;

  if (!document.createElement) 
      return false;

  var images = document.getElementsByTagName("img");
  if (images.length < 1) 
      return false; 

  for (var i=0; i<images.length; i++) {
      var title = images[i].getAttribute("alt");

      if (title != ""){
          var divCaption = document.createElement("div");
          divCaption.className = "caption";
          var divCaption_text = document.createTextNode(title);
          divCaption.appendChild(divCaption_text);
          var divContainer = document.createElement("div");
          divContainer.className="imgcontainer";
          images[i].parentNode.insertBefore(divContainer,images[i]);
          divContainer.appendChild(images[i]);
          insertAfter(divCaption,images[i]);
      }
  }
}

app.run(function($rootScope) {
  var hash_loc = hash_params ? hash_params : {'center': {'lat': 40.7154, 'lng': -73.9967}, 'zoom': 14};
  $rootScope.geobase = {
    'zoom': hash_loc.zoom,
    'lat' : hash_loc.center.lat,
    'lon' : hash_loc.center.lng
  }
  $(document).on('new-location', function(e){
    $rootScope.geobase = {
      'zoom': e.zoom,
      'lat' : e.lat,
      'lon' : e.lon
    };
  })
});

app.controller('SearchController', function($scope, $rootScope, $sce, $http) {
    // --------- suggestions ---------
  var map = L.map('map', {
      zoom: $rootScope.geobase.zoom,
      zoomControl: false,
      center: [$rootScope.geobase.lat, $rootScope.geobase.lon],
      maxBounds: L.latLngBounds(L.latLng(-80, -180), L.latLng(82, 180))
  });
  window.map = map;
  
  var hash_style = hash_params ? hash_params.s : false;
  if (hash_style){
    $scope.style = hash_style;
  } else {
    $scope.style = 'default';
  }

  var style_file = styles[$scope.style]+'.yaml';

  var layer = Tangram.leafletLayer({
      scene: style_file,
      attribution: 'Map data &copy; OpenStreetMap contributors | <a href="https://github.com/tangrams/tangram" target="_blank">Source Code</a>'
  });

  var mdFileURL = styles[$scope.style]+'.md';
  var mdText = fetchHTTP(mdFileURL);
  document.getElementById('content').innerHTML = marked(mdText);
  captionizeImages();

  // Load codes tags that have "src" attributes
  var list = document.getElementsByTagName("code");
  for(var i = 0; i < list.length; i++){
    if (list[i].className == "lang-glsl" || 
      list[i].className == "lang-bash" || 
      list[i].className == "lang-cpp" || 
      list[i].className == "lang-html" ||
            list[i].className == "lang-processing" ){
      hljs.highlightBlock(list[i]);
    }
  }

  loadShaders();

  window.layer = layer;
  var scene = layer.scene;
  window.scene = scene;

  // Resize map to window
  function resizeMap() {
      document.getElementById('map').style.width = window.innerWidth + 'px';
      document.getElementById('map').style.height = window.innerHeight + 'px';
      map.invalidateSize(false);
  }

  window.addEventListener('resize', resizeMap);
  resizeMap();

  window.addEventListener('load', function () {
      // Scene initialized
      layer.addTo(window.map);
  });

  new L.Control.Zoom({ position: 'topright' }).addTo(map);
  L.control.locate({ position: 'topright', keepCurrentZoomLevel: true }).addTo(map);
  L.control.search({ position: 'topright', keepCurrentZoomLevel: true }).addTo(map);
  L.control.locations({ position: 'topright', keepCurrentZoomLevel: true }).addTo(map);
  L.control.styles({ position: 'topright', keepCurrentZoomLevel: true }).addTo(map);
  // Set up the hash
  var hash = new L.Hash(map);
  var marker;
  var markers = [];
  var remove_markers = function(){

    for (i=0; i<markers.length; i++) {
      map.removeLayer(markers[i]);
    }
    markers = [];
  };

  $rootScope.$on( 'map.setView', function( ev, geo, zoom ){
    map.setView( geo, zoom || 8 );
  });

  $rootScope.$on( 'map.dropMarker', function( ev, geo, text, icon_name ){
    marker = new L.marker(geo).bindPopup(text);
    map.addLayer(marker);
    markers.push(marker);
    marker.openPopup();
  });

  $rootScope.$on( 'map.dropGeoJson', function( ev, data ){
    remove_markers();
    var geoJsonLayer = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        markers.push(layer);
        layer.bindPopup(feature.properties.text);
      }
    }).addTo(map);
    geoJsonLayer.addData(data);
  });

  $rootScope.$on( 'map.removeAllMarkers', function( ev, geo, text ){
    remove_markers();
  });

  $rootScope.$on( 'fullTextSearch', function( ev, text, searchType, geoBias, style ){
    $(document).trigger({
      'type': "pelias:fullTextSearch",
      'text' : text,
      'searchType' : searchType,
      'geoBias': geoBias,
      'style': style
    });
  });

  // map.on('click', function(e) {
  //   var geo = {
  //     'lat': e.latlng.lat,
  //     'lon': e.latlng.lng
  //   };
  //   reverse(geo);
  // });

  var highlight = function( text, focus ){
    var r = RegExp( '('+ focus + ')', 'gi' );
    return text.replace( r, '<strong>$1</strong>' );
  }

  var icon = function( type ){
    if( type.match('geoname') ){
      return 'screenshot';
    } else if( type.match('osm') ){
      return 'globe';
    } else if( type.match('admin0') ){
      return 'flag';
    } else if( type.match('admin') ){
      return 'tower';
    } else if( type.match('neighborhood') ){
      return 'home';
    } else if( type.match('search') ){
      return 'search';
    }
    return 'map-marker';
  };

  var resultSelected = function(search, geo, changeQuery) {
    $rootScope.$emit( 'map.removeAllMarkers' );
    if (changeQuery) {
      $scope.search = search;
      $rootScope.$emit( 'hideall' );
    }
    $rootScope.$emit( 'map.setView', geo.reverse(), $rootScope.geobase.zoom );
    $rootScope.$emit( 'map.dropMarker', geo, search, 'search');
  };

  var computeDistance = function(geo) {
    var p1 = new LatLon( $rootScope.geobase.lat, $rootScope.geobase.lon );
    var p2 = new LatLon( geo[1], geo[0] );
    var distance = Number( p1.distanceTo(p2) );
    return distance.toFixed( distance < 1 ? 2 : 0 );
  }

  var reverse = function(geo) {
    $http({
      url: $scope.api_url+'/reverse',
      method: 'GET',
      params: {
        lat: geo.lat,
        lon: geo.lon,
        zoom:$rootScope.geobase ? $rootScope.geobase.zoom : 14
      },
      headers: { 'Accept': 'application/json' }
    }).success(function (data, status, headers, config) {
      if (data) {
        var geo = data.features[0].geometry.coordinates;
        var txt = data.features[0].properties.text;
        $rootScope.$emit( 'map.dropMarker', geo.reverse(), txt, 'star');
      } else { }
    })
  };

  var getResults = function(url, resultkey) {
    var params = {
      input: $scope.search,
      // datasets: $scope.queryDatasets.join(','),
      size: 10
    }

    if ($scope.geobias === 'bbox') {
      var bounds = map.getBounds();
      var bbox = [];
      bbox.push(bounds._northEast.lat);
      bbox.push(bounds._northEast.lng);
      bbox.push(bounds._southWest.lat);
      bbox.push(bounds._southWest.lng);
      params.bbox= bbox.length === 4  ? bbox.join(',') : '';
    } 

    // for suggester to work, you need lat/lon even if geobias=bbox
    if ($scope.geobias === 'bbox' || $scope.geobias === 'loc') {
      params.lat = $rootScope.geobase ? $rootScope.geobase.lat : 0;
      params.lon = $rootScope.geobase ? $rootScope.geobase.lon : 0;
      params.zoom= $rootScope.geobase ? $rootScope.geobase.zoom : 14;
    }
    
    $http({
      url: $scope.api_url+url,
      method: 'GET',
      params: params,
      headers: { 'Accept': 'application/json' }
    }).success(function (data, status, headers, config) {
      if( data ){
        if (resultkey=='searchresults') {
          $rootScope.$emit( 'map.dropGeoJson', data );
        }
        $scope[resultkey].length = 0;
        $scope[resultkey] = data.features.map( function( res ){
          res.htmltext = $sce.trustAsHtml(highlight( res.properties.text, $scope.search ));
          res.icon = icon( res.properties.type || 'search' );
          res.type = res.properties.type;
          res.distance = computeDistance(res.geometry.coordinates);
          return res;
        });
      }
      else {
        $scope[resultkey] = [];
      }
    }).error(function (data, status, headers, config) {
      $scope[resultkey] = [];
    });
  };

  $scope.search = '';
  $scope.searchresults = [];
  $scope.suggestresults = [];
  $scope.geobias = 'off';
  $scope.geobiasClass = 'fa-th';
  $scope.geobiasInfo = 'the view port/ bounding box';
  $scope.searchType = 'fine';
  $scope.api_url = '//pelias.mapzen.com';

  $scope.switchType = function(type) {
    $scope.searchType = type === 'fine' ? 'coarse' : 'fine';
    $rootScope.$emit( 'hideall' );
    $scope.fullTextSearch();
  };

  $scope.setGeobias = function(geobias) {
    if (geobias === 'bbox') {
      $scope.geobias = 'bbox';
      $scope.geobiasClass = 'fa-th';
      $scope.geobiasInfo = 'the view port/ bounding box';
    } else if (geobias === 'loc') {
      $scope.geobias = 'loc';
      $scope.geobiasClass = 'fa-location-arrow';
      $scope.geobiasInfo = 'the lat/lon/zoom (center of the screen)';
    } else if (geobias === 'off') {
      $scope.geobias = 'off';
      $scope.geobiasClass = 'fa-globe';
      $scope.geobiasInfo = 'no location information';
    } else {
      $scope.switchGeobias();
    }
  };

  $scope.switchGeobias = function(geobias) {
    if (geobias === 'bbox') {
      $scope.setGeobias('loc');
    } else if (geobias === 'loc') {
      $scope.setGeobias('off');
    } else if (geobias === 'off') {
      $scope.setGeobias('bbox');
    } else {
      $scope.setGeobias('off');
    }
    $rootScope.$emit( 'hideall' );
    $scope.fullTextSearch();
  };

  $scope.selectResult = function( result, changeQuery ){
    resultSelected(result.properties.text, result.geometry.coordinates, changeQuery)
  }

  $rootScope.$on( 'hideall', function( ev ){
    $scope.suggestresults = [];
    $scope.searchresults = []
  });

  $rootScope.$on( 'hidesuggest', function( ev ){
    $scope.suggestresults = [];
  });

  $rootScope.$on( 'hidesearch', function( ev ){
    $scope.searchresults = [];
  });

  $scope.keyPressed = function(ev) {
    if (ev.which == 13) {
      $("#suggestresults").addClass("smaller");
      $scope.fullTextSearch();
    } else {
      $("#suggestresults").removeClass("smaller");
      $rootScope.$emit('hidesearch');
    }
  }

  $scope.onFocus = function(ev) {
    $("#searchresults").removeClass("smaller");
  }

  $scope.onBlur = function(ev) {
    $("#searchresults").addClass("smaller");
  }

  $scope.suggest = function(){

    if( !$scope.search.length ) {
      $rootScope.$emit( 'hideall' );
      return;
    }

    var url = $scope.searchType.toLowerCase() === 'fine' ? '/suggest' : '/suggest/coarse';
    getResults(url, 'suggestresults');
  }

  $scope.fullTextSearch = function(){

    if( !$scope.search.length ) {
      $rootScope.$emit( 'hideall' );
      return;
    }
    $rootScope.$emit('fullTextSearch', $scope.search, $scope.searchType, $scope.geobias, $scope.style);

    var url = $scope.searchType.toLowerCase() === 'fine' ? '/search' : '/search/coarse';
    getResults(url, 'searchresults');
  }

  $scope.$watch( 'search', function( input ){
    $scope.suggest();
  });

  // faking a search when query params are present
  var hash_query  = hash_params ? hash_params.q : false;
  if (hash_query){
    $scope.search = hash_query
    $scope.keyPressed({ 'which': 13});
    $("#searchresults").addClass("smaller");
  }
  var hash_search_type  = hash_params ? hash_params.t : false;
  if (hash_search_type){
    $scope.searchType = hash_search_type;
    $scope.keyPressed({ 'which': 13});
  }
  var hash_geobias  = hash_params ? hash_params.gb : false;
  if (hash_geobias){
    $scope.geobias = hash_geobias;
    $scope.setGeobias(hash_geobias);
    $scope.keyPressed({ 'which': 13});
  }

  $(document).on('new-location', $scope.suggest);
})

window.onload = function(){
  renderShaders(); 
};
