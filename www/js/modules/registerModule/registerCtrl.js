angular.module('registerModule', ['toastModule','localStorageModule','alertModule'])
.controller('registerCtrl', function ($scope, registerFactory, toastFactory, $state, localStorageFactory) {

  $scope.imei = localStorageFactory.getKey("uuid");
  /*
  setInterval ( function () {
    $scope.dataAgora = new Date().getHours()+":"+new Date().getMinutes()+":"+new Date().getSeconds();
    cordova.plugins.backgroundMode.configure({text: $scope.dataAgora});
  }, 3000);
  */
  registerFactory.isRegistered($scope.imei);

  /*
  alert("registrado: "+localStorageFactory.getKey("isRegistered")+'\n'
        +"logado: "+localStorageFactory.getKey("isLogged"));
  */
  $scope.sendDataToRegister = function (registerData) {
    registerData.device_imei = localStorageFactory.getKey("uuid");
    registerData.onesignal_id = localStorageFactory.getKey("onesignal_id");
    if (registerData.cpu === undefined) {
      registerData.cpu = false;
    }
    if (registerData.battalion === undefined) {
      registerData.battalion = "BPM TESTE FIXO";
    }
    registerFactory.register(registerData);
  }

})
