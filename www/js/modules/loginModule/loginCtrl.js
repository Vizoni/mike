angular.module('loginModule', ['toastModule', 'localStorageModule', 'loadingModule', 'alertModule', 'pushModule'])
.controller('loginCtrl', function ($scope, loginFactory, localStorageFactory, $state,
                                    config, loadingFactory, alertFactory, pushFactory) {

  $scope.car = {
    carPrefix: localStorageFactory.getKey("carPrefix"), //ind_patrimonio
    carType: localStorageFactory.getKey("carType"), //ind_patrimonio
    cpu: localStorageFactory.getKey("cpu"),
    carOnDutyStatus: localStorageFactory.getKey("carOnDutyStatus"), //prioridade
  };
  $scope.occupants = [];
  $scope.occupants[0] = '';
  $scope.ocupantes = [];

  $scope.addOccupant = function () {
    $scope.occupants = loginFactory.addOccupant($scope.occupants);
  }

  $scope.deleteOccupant = function (key) {
    loginFactory.deleteOccupant(key,$scope.occupants);
  }

  $scope.sendDataToLogin = function () {
    var carPrefix = localStorageFactory.getKey("carPrefix");
    $scope.occupants.patrolman[0] = $scope.occupants.driver;
    /*$scope.occupants.patrolman é um OBJETO, tem q transformar pra array*/
    var occupantsDocumentNumberArray = [];
    for (var key in $scope.occupants.patrolman) {
       if ($scope.occupants.patrolman.hasOwnProperty(key)) {
           occupantsDocumentNumberArray.push(Base64.encode($scope.occupants.patrolman[key]));
       }
    }
    var isValid = loginFactory.checkNoRepeatedOccupant(occupantsDocumentNumberArray);
    if (isValid) {
      //alert("Não pode repetir RG!");
      alertFactory.showDangerAlert("Atenção", "Um ou mais RG's estão repetidos!");
      return;
    }
    var loginParams = {
      carPrefix: Base64.encode(carPrefix),
      occupant_document: occupantsDocumentNumberArray,
      apiauth: localStorageFactory.getAPIAuth()
    }
    loadingFactory.showDefaultLoading();
    loginFactory.login(loginParams).then( function (response) {
      if (response.data.message) {
        loadingFactory.hide();
        $scope.occupants = [];
        localStorageFactory.setKey("isLogged",1);
        localStorageFactory.setKey("positionUpdated",0);
        $state.go('map');
      } else {
        loadingFactory.hide();
        alertFactory.showPositiveAlert("Atenção", "Um ou mais RG's estão inválidos!");
      }
    }, function (error) {
      loadingFactory.hide();
      alertFactory.showNoInternet();
    });
  }

/*==================================================================================================*/
  $scope.viewMapa = function () {
      /* TIRAR DAQUI DEPOIS \/ */
      $state.go('map');
  }
  $scope.reset = function () {
      /* TIRAR DAQUI DEPOIS \/ */
      localStorageFactory.removeKey("carPrefix");
      localStorageFactory.removeKey("carType");
      localStorageFactory.removeKey("isRegistered");
      localStorageFactory.removeKey("isLogged");
      localStorageFactory.removeKey("positionUpdated");
      localStorageFactory.removeKey("cpu");
      localStorageFactory.removeKey("onDutyStatus");
      localStorageFactory.removeKey("visible");
      //alert("Chaves: carPrefix, carType, isRegistered, isLogged removidas!");
      alertFactory.showDangerAlert("Atenção","Chaves removidas com sucesso!");
  }

  $scope.testar = function () {
    var teste = {
      carPrefix: '222',
      onDutyStatus: '4'
    }
    pushFactory.send(teste);
  }

})
