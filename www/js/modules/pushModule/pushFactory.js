angular.module('pushModule', [])
.factory('pushFactory', function ($http, config) {


  var _send = function (params) {
      return $http.post(config.baseUrl+"/api/push.php",params);
  }


  return {
    send: _send,
  }

})
