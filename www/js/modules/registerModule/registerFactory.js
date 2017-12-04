angular.module('registerModule')
.factory('registerFactory', function($http, config, localStorageFactory, toastFactory, $state, loadingFactory, alertFactory) {

  var _register = function (registerFormObj) {
    loadingFactory.showDefaultLoading();
    return $http.post(config.baseUrl + '/api/registerdevice.php', registerFormObj).then( function (response) {
        loadingFactory.hide();
        localStorageFactory.registerDeviceToCar(registerFormObj.car_prefix, response.carType, registerFormObj.cpu);
        if (response.data.exists == false) {
          alertFactory.showPositiveAlert("Atenção","Prefixo da viatura inválido!","Entendi!");
        } else if (response.data.gotRegistered == true) {
          //toastFactory.show("Cadastrado com sucesso!",3000);
          localStorageFactory.setKey("carType",response.data.carType);
          localStorageFactory.setKey("isRegistered",1);
          localStorageFactory.setKey("positionUpdated",0);
          localStorageFactory.setKey("visible",0);
          localStorageFactory.setKey("onDutyStatus",1);
          $state.go("login");
        } else {
          alertFactory.showDangerAlert("Atenção","Não foi possível cadastrar!");
        }
    }, function (error) {
      //loadingFactory.hide();
      alertFactory.showNoInternet();
    });;
  }

  var _isRegistered = function (myUuid) {
    myUuid = {'uuid': myUuid};
    loadingFactory.showDefaultLoading();
    return $http.post(config.baseUrl + '/api/isregistered.php',myUuid).then( function (response) {
      /* Se tiver resposta (response) é q está cadastrado, vai verificar se está logado ou não.
         Se não houver resposta (response) não vai fazer nada, vai mantar na tela de registro */
      loadingFactory.hide();
      if (response.data) {
        localStorageFactory.setKey("isRegistered",1);
        if (response.data.isLogged) {
          localStorageFactory.setKey("isLogged",1);
          localStorageFactory.setKey("positionUpdated",1);
          $state.go("map");
        } else {
          localStorageFactory.setKey("isLogged",0);
          localStorageFactory.setKey("positionUpdated",0);
          $state.go("login");
        }
      } else {
        alert("nao teve resposta da api");
      }
    }, function (error) {
      loadingFactory.hide();
      alertFactory.showNoInternet();
    });

  }

  return {
    register: _register,
    isRegistered: _isRegistered,
  };

})
