angular.module('mapModule', ['markerModule','localStorageModule','geolocationModule','loadingModule','alertModule'])
.controller('mapCtrl', function ($scope, mapFactory, markerFactory, localStorageFactory, geolocationFactory, loadingFactory, alertFactory) {

  var map = '';
  $scope.carsMarkers = [];
  $scope.finalMarkers = [];

  $scope.me = {
    carPrefix: localStorageFactory.getKey("carPrefix"),
    carType: localStorageFactory.getKey("carType"),
    onesignal_id: localStorageFactory.getKey("onesignal_id"),
    uuid: localStorageFactory.getKey("uuid"),
    uuidB64: localStorageFactory.getKey("uuidB64"),
    onDutyStatus: localStorageFactory.getKey("onDutyStatus"),
    cpu: localStorageFactory.getKey("cpu"),
    longitude: localStorageFactory.getKey("longitude"),
    latitude: localStorageFactory.getKey("latitude")
  }

  $scope.initMap = function () {
    map = mapFactory.init();
    $scope.onDutyStatus = localStorageFactory.getKey("onDutyStatus");
  }

  $scope.getPosition = function (map) {
    loadingFactory.showUpdatingPositionLoading();
    $scope.carsMarkers = mapFactory.clearMap($scope.carsMarkers);
    if ($scope.me.cpu == "true") {
      /*rota se for CPU*/
      markerFactory.getCarsPositionForCPU(localStorageFactory.getAPIAuthInObject()).then( function (response) {
        $scope.carsMarkers = response.data;
        // loadingFactory.hide();
        $scope.createMarkerAndShowOnMap($scope.carsMarkers,map);
      }, function (error) {
        loadingFactory.hide();
        alertFactory.showCouldNotUpdatePositions();
      });
      // setTimeout( function () {
      //   console.log("timeout cpu");
      //   loadingFactory.hide();
      // },2000);
    } else {
      /*rota se não for CPU*/
      var _objNotCPU = {
        carPrefix: localStorageFactory.getKey("carPrefix"),
        apiauth: localStorageFactory.getAPIAuth()
      }
      markerFactory.getCarsPosition(_objNotCPU).then( function (response) {
        $scope.carsMarkers = response.data;
        // loadingFactory.hide();
        $scope.createMarkerAndShowOnMap($scope.carsMarkers,map);
      }, function (error) {
        loadingFactory.hide();
        alertFactory.showCouldNotUpdatePositions();
        //alert("erro na api não-cpu: " + error);
      });
      // setTimeout( function () {
      //   console.log("timeout normal");
      //   loadingFactory.hide();
      // },2000);
    }
    if (localStorageFactory.getKey("onDutyStatus") == 0) {
      /* Se recebeu a posiçao das outras viaturas é que tem internet
         Verifica se estava cinza (sem net), se estiver, seta como patrulhando (com internet)
      */
      localStorageFactory.setKey("onDutyStatus",1);
      $scope.onDutyStatus = localStorageFactory.getKey("onDutyStatus");
      // alert("Status era 0 agora é 1!!");
    }
  }

  $scope.updateOnDutyStatus = function () {
    /*  Em patrulhamento = 1
        Em emergência = 4
        A viatura só pode setar se entra em emergencia ou volta para o patrulhamento
        Os demais status serão realizados apenas pelo COPOM via requisição por rádio */
    if (localStorageFactory.getKey("onDutyStatus") == 1) {
      localStorageFactory.setKey("onDutyStatus",4);
    } else if (localStorageFactory.getKey("onDutyStatus") == 4) {
      localStorageFactory.setKey("onDutyStatus",1);
    }
    $scope.onDutyStatus = localStorageFactory.getKey("onDutyStatus");
  }

  $scope.initMap();

  $scope.createMarkerAndShowOnMap = function (position, map) {
    var markers = markerFactory.createMarker(position);
    $scope.carsMarkers = mapFactory.addMarker(markers,map);
    return $scope.carsMarkers;
  }
  /*______________________________________________________________________________________________________*/
  // var checkDistance = function (lat1, lon1, lat2, lon2) {
  //   var unit = "K";
  //   var radlat1 = Math.PI * lat1/180
  //   var radlat2 = Math.PI * lat2/180
  //   var radlon1 = Math.PI * lon1/180
  //   var radlon2 = Math.PI * lon2/180
  //   var theta = lon1-lon2
  //   var radtheta = Math.PI * theta/180
  //   var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  //   dist = Math.acos(dist)
  //   dist = dist * 180/Math.PI
  //   dist = dist * 60 * 1.1515
  //   if (unit=="K") { dist = dist * 1.609344 }
  //   if (unit=="N") { dist = dist * 0.8684 }
  //   dist = parseFloat(Math.round(dist * 100) / 100).toFixed(2);
  //   return dist
  // }

  /*__________________________________________________________________________________________________________*/

  var refreshPositionInterval = setInterval( function () {
    if (localStorageFactory.getKey("isLogged") == 1 && localStorageFactory.getKey("onDutyStatus") != 0) {
      geolocationFactory.getCurrentPosition();

      /*=======================================================================*/
      /*
      var distancia = checkDistance( localStorageFactory.getKey("latitude"),localStorageFactory.getKey("longitude"),
                                      localStorageFactory.getKey("latitude_antiga"),localStorageFactory.getKey("longitude_antiga")  );
      if (distancia >= 0.3) {
        console.log("a distancia é maior: "+distancia);
        alert("Inseriu no registro!");
        geolocationFactory.teste();
      } else {
        console.log("a distancia é menor: "+distancia);
        alert("Não atualizou a posição. Diferença: "+distancia+" KM" + /n/ + "Mínimo 0.3!");
      }
      */
      /*=======================================================================*/
      var myCurrentPosition = geolocationFactory.prepareCarPosition();
      geolocationFactory.updateMyPosition(myCurrentPosition);
      $scope.getPosition(map);
    } else {
      clearInterval(refreshPositionInterval);
    }
  }, 10000);

  var insertCarPositionInterval = setInterval( function () {
    /* 2 minutos*/
    if (localStorageFactory.getKey("isLogged") == 1 && localStorageFactory.getKey("onDutyStatus") != 0) {
      geolocationFactory.saveCarRoute();
    } else {
      clearInterval(insertCarPositionInterval);
    }
  }, 120000);

})
