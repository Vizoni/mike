angular.module('mapModule')
.factory('mapFactory', function (markerFactory) {

var map = '';
var marcadores = [];

var _init = function () {
  var mapOptions = {
      center: {lat: -23.4208945, lng: -51.9354924},
      zoom: 13,
      streetViewControl: false,
      mapTypeControl: false,
      scaleControl: false,
      zoomControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  return map;
}

var _addMarker = function (markerConfig, map) {
  var arrayDeRetorno = [];
  for (var i = 0; i < markerConfig.length; i++) {
    marcador = new MarkerWithLabel(markerConfig[i]);
    marcador.setMap(map);
    arrayDeRetorno.push(marcador);
  }
  return arrayDeRetorno;
}

var _clearMap = function (markerLabeledWithMap) {
  for (var i = 0; i < markerLabeledWithMap.length; i++) {
    markerLabeledWithMap[i].setMap(null);
  }
}

  return {
    init: _init,
    addMarker: _addMarker,
    clearMap: _clearMap,
  }

});
