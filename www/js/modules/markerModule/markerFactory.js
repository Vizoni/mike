angular.module('markerModule', [])
.factory('markerFactory', function ($http,config) {

/*
  STATUS CARROS:
  0 - CINZA - STAND BY
  1 - AZUL - PATRULHAMENTO
  2 - VERDE - ATENDIMENTO
  3 - AMARELO - ABORDAGEM / APOIO
  4 - VERMELHO - PRIORIDADE
*/

  var _getCarsPositionForCPU = function (APIAuth) {
    return $http.post(config.baseUrl+"/api/getcarspositioncpu.php",APIAuth);
  };

  var _getCarsPosition = function (myCarPrefix) {
    return $http.post(config.baseUrl+"/api/getcarsposition.php",myCarPrefix);
  };


  var _createMarker = function (carsPositionsOBJ) {
    var _length = carsPositionsOBJ.length;
    var _carsArray = [];
    for (var i = 0; i < _length; i++) {
      _carsArray[i] = {
                        //animation: google.maps.Animation.DROP,
                        position: new google.maps.LatLng(carsPositionsOBJ[i]['latitude'], carsPositionsOBJ[i]['longitude']),
                        labelContent: carsPositionsOBJ[i]['carPrefix'],
                        labelAnchor: new google.maps.Point(22,0),
                        labelClass: "markerLabel", //  CSS class for the label (folder www/css/style.css)
                        labelInBackground: false,
                        labelStyle: {opacity: 0.75},
                        icon: 'img/markers/marker_patrol.png'
                    };
      _setCarIcon(carsPositionsOBJ[i],_carsArray[i]);
    }
    return _carsArray;
  }

  var _setCarIcon = function (carsObj, carsMarker) {
    var _onDutyStatus = carsObj.onDutyStatus;
    if (_onDutyStatus == 0) {
      carsMarker.icon = 'img/markers/marker_off.png';
    } else if (_onDutyStatus == 1) {
      carsMarker.icon = 'img/markers/marker_patrol.png';
    } else if (_onDutyStatus == 2) {
      carsMarker.icon = 'img/markers/marker_busy.png';
    } else if (_onDutyStatus == 3) {
      carsMarker.icon = 'img/markers/marker_approach.png';
    } else if (_onDutyStatus == 4) {
      carsMarker.icon = 'img/markers/marker_emergency.png';
    }
    return carsMarker;
  }

  return {
    getCarsPosition: _getCarsPosition,
    getCarsPositionForCPU: _getCarsPositionForCPU,
    createMarker: _createMarker,
    setCarIcon: _setCarIcon,
  }

});
