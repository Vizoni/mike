angular.module('toastModule', ['ngCordova'])
.factory('toastFactory', function ($cordovaToast) {

  var _show = function (msg,duration) {
    if (typeof msg === "undefined") {
      msg = false;
    }
    if (typeof duration === "undefined") {
      duration = 5000; //5s default
    }
    if (msg) {
      $cordovaToast.show(msg,duration,'bottom');
    }
  }

  return {
    show: _show
  };

});
