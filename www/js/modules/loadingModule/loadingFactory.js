angular.module('loadingModule', [])
.factory('loadingFactory', function ($ionicLoading) {

  var _show = function (myHTML) {
    $ionicLoading.show({
       template: myHTML,
     });
  }

  var _hide = function () {
    $ionicLoading.hide();
  }

  var _showUpdatingPositionLoading = function () {
    var myHTML = '<ion-spinner class="spinner-assertive" icon="ripple"></ion-spinner>'+'\n'
                +'<h4>Atualizando posições</h4>';
    // _show(myHTML);
    $ionicLoading.show({
       template: myHTML,
       duration: 2500,
     });
  }

  var _showNoTextLoading = function () {
    var myHTML = '<ion-spinner class="spinner-positive" icon="dots"></ion-spinner>';
    _show(myHTML);
  }

  var _showDefaultLoading = function () {
    var myHTML = '<ion-spinner class="spinner-assertive" icon="spiral"></ion-spinner>'+'\n'
                +'<h4>Carregando...</h4>';
    //_show(myHTML);
    $ionicLoading.show({
       template: myHTML,
       duration: 5000,
     });
  }


  return {
    show: _show,
    hide: _hide,
    showUpdatingPositionLoading: _showUpdatingPositionLoading,
    showDefaultLoading: _showDefaultLoading,
    showNoTextLoading: _showNoTextLoading
  }

})
