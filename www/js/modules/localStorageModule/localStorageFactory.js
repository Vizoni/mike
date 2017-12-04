angular.module('localStorageModule', [])
.factory('localStorageFactory', function () {

  var _setKey = function (key,value) {
    localStorage.setItem(key,value);
  };

  var _getKey = function (key) {
    return localStorage.getItem(key);
  };

  var _getCurrentDate = function () {
    function addZeroToFixDataIssue(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
    var currentdate = new Date();
    var datetime = currentdate.getFullYear() + "-"
                + addZeroToFixDataIssue((currentdate.getMonth()+1))  + "-"
                + addZeroToFixDataIssue(currentdate.getDate()) + " "
                + addZeroToFixDataIssue(currentdate.getHours()) + ":"
                + addZeroToFixDataIssue(currentdate.getMinutes()) + ":"
                + addZeroToFixDataIssue(currentdate.getSeconds());
    return datetime;
  }


  var _getAPIAuthInObject = function () {
    return {
      apiauth: localStorage.getItem("uuidB64")+"|"+Base64.encode(_getCurrentDate())
    }
  }

  var _getAPIAuth = function () {
    return localStorage.getItem("uuidB64")+"|"+Base64.encode(_getCurrentDate());
  }

  var _setLogged = function () {
    localStorage.setItem("isLogged",1);
    localStorage.setItem("positionUpdated",1);
  }

  var _setDisconnected = function () {
    localStorage.setItem("isLogged",0);
    localStorage.setItem("positionUpdated",0);
    localStorage.setItem("onDutyStatus",1);
  }

  var _registerDeviceToCar = function (carPrefix,carType,cpu) {
    localStorage.setItem("carPrefix",carPrefix);
    localStorage.setItem("carType",carType);
    localStorage.setItem("cpu",cpu);
  }

  var _removeKey = function (key) {
    localStorage.removeItem(key);
  }

  return {
    setKey: _setKey,
    getKey: _getKey,
    getCurrentDate: _getCurrentDate,
    getAPIAuth: _getAPIAuth,
    getAPIAuthInObject: _getAPIAuthInObject,
    setLogged: _setLogged,
    setDisconnected: _setDisconnected,
    registerDeviceToCar: _registerDeviceToCar,
    removeKey: _removeKey,
  };

})
