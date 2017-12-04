angular.module('alertModule', [])
.factory('alertFactory', function ($ionicPopup) {

  var _showDangerAlert = function (title,text,buttonText) {
    if (typeof title == "undefined") {
      title = "Falhou";
    }
    if (typeof text == "undefined") {
      text = "Algo deu errado!";
    }
    if (typeof buttonText == "undefined") {
      buttonText = "OK!";
    }
    buttonText = " "+buttonText;
    $ionicPopup.alert({
          title: title,
          template: text,
          okText: buttonText,
          okType: 'ion-checkmark-round button-assertive'
    });
  }

  var _showPositiveAlert = function (title,text,buttonText) {
    if (typeof title == "undefined") {
      title = "Atenção";
    }
    if (typeof text == "undefined") {
      text = "Ocorreu algum problema...";
    }
    if (typeof buttonText == "undefined") {
      buttonText = "Entendi!";
    }
    buttonText = " "+buttonText;
    $ionicPopup.alert({
          title: title,
          template: text,
          okText: buttonText,
          okType: 'ion-checkmark-round button-balanced'
    });
  }

  var _showNoInternet = function () {
    $ionicPopup.alert({
          title: "Falha na conexão!",
          template: "Você precisa estar conectado à internet!",
          okText: " Entendi!",
          okType: 'ion-wifi button-assertive'
    });
  }

  var _showCouldNotUpdatePositions = function () {
    $ionicPopup.alert({
          title: "Falha na conexão!",
          template: "Não foi possível atualizar as posições! Verifique sua conexão.",
          okText: " OK!",
          okType: 'ion-wifi button-assertive'
    });
  }

  return {
    showDangerAlert: _showDangerAlert,
    showPositiveAlert: _showPositiveAlert,
    showNoInternet: _showNoInternet,
    showCouldNotUpdatePositions: _showCouldNotUpdatePositions,
  }

})
