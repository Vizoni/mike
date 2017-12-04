angular.module('geolocationModule', ['localStorageModule', 'alertModule'])
.factory('geolocationFactory', function ($http, config, $state, localStorageFactory, alertFactory) {

  var _getCurrentPosition = function () {
    var onSuccess = function (position) {
      //var speed = position.coords.speed;
      // localStorageFactory.setKey("latitude_antiga",localStorageFactory.getKey("latitude"));
      // localStorageFactory.setKey("longitude_antiga",localStorageFactory.getKey("longitude"));
      localStorageFactory.setKey("latitude",position.coords.latitude);
      localStorageFactory.setKey("longitude",position.coords.longitude);
      /*CHAMAR FUNÇAO PRA API*/

    }
    var onError = function (error) {
      alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
    }
    return navigator.geolocation.getCurrentPosition(onSuccess,onError);
  }

  var _updateMyPosition = function (preparedPositionObject) {
      return $http.post(config.baseUrl+"/api/insertposition.php",preparedPositionObject)
          .then( function (response) {
              if (response.data.message) {
                localStorageFactory.setKey("positionUpdated",1);
              }
              if (!response.data.isLogged) {
                /* verificar erro que estava dando no MYSQL
                  Máximo numero de conexões (3) acessando ao mesmo tempo no hostinger plano free */
                console.log("B -> MYSQL: ");
                console.log(typeof(response.data.isLogged,response.data.isLogged));
              }
              if (typeof(response.data.isLogged) != 'undefined' && response.data.isLogged == false) {
                /* Se o isLogged for false então ele foi deslogado mesmo*/
                console.log("C: ");
                console.log(typeof(response.data.isLogged,response.data.isLogged));
                localStorageFactory.setDisconnected();
                alertFactory.showPositiveAlert("Desligado!","Você foi desligado do sistema pelo COPOM.","Entendi!");
                $state.go("login");
              }
            }, function (error) {
              /* Sem conexão com a internet, mas logado*/
              alertFactory.showCouldNotUpdatePositions();
              // localStorageFactory.setKey("onDutyStatus",0);
            });
  }

  var _prepareCarPosition = function () {
    var duty = localStorageFactory.getKey("onDutyStatus");
    if (duty == 3 || duty == 4) {
      var visible = '1';
    } else {
      var visible = '0';
    }
    var alreadyUpdated = localStorageFactory.getKey("positionUpdated");
    var aux = {
      latitude: Base64.encode(localStorageFactory.getKey("latitude")),
      longitude: Base64.encode(localStorageFactory.getKey("longitude")),
      carPrefix: Base64.encode(localStorageFactory.getKey("carPrefix")),
      onDutyStatus: Base64.encode(localStorageFactory.getKey("onDutyStatus")),
      positionUpdated: Base64.encode(alreadyUpdated),
      visible: Base64.encode(visible),
      date: Base64.encode(localStorageFactory.getCurrentDate()),
      apiauth: localStorageFactory.getAPIAuth()
    }
    return aux;
  }

  /*____________________________________________________________________________*/
  var _saveCarRoute = function () {
    object = {
      latitude: Base64.encode(localStorageFactory.getKey("latitude")),
      longitude: Base64.encode(localStorageFactory.getKey("longitude")),
      carPrefix: Base64.encode(localStorageFactory.getKey("carPrefix")),
      onDutyStatus: Base64.encode(localStorageFactory.getKey("onDutyStatus")),
      date: Base64.encode(localStorageFactory.getCurrentDate()),
      apiauth: localStorageFactory.getAPIAuth()
    }
    return $http.post(config.baseUrl+"/api/api_basica_insert.php",object)
    .then( function (response) {
        // console.log("sucesso api registrar posicao daily_route");
        // console.log(response.data);
      }, function (error) {
        /* Sem conexão com a internet, mas logado*/
        console.log("erro api de registrar posiçao no daily_route");
        //alertFactory.showCouldNotUpdatePositions();
        //localStorageFactory.setKey("onDutyStatus",0);
      });
  }
  /*____________________________________________________________________________*/

  return {
    getCurrentPosition: _getCurrentPosition,
    prepareCarPosition: _prepareCarPosition,
    updateMyPosition: _updateMyPosition,
    saveCarRoute: _saveCarRoute
  }

})
