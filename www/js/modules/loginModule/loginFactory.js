angular.module('loginModule')
.factory('loginFactory', function($http, config) {

  var _addOccoupant = function (occupantsArray) {
    var total = occupantsArray.length;
    var ultimo = total + 1;
    occupantsArray.push(occupantsArray[ultimo]);
    return occupantsArray;
  };

  var _deleteOccupant = function (key,occupantsArray) {
    var chave = key - 1;
    occupantsArray.splice(chave,1);
  };

  var _checkNoRepeatedOccupant = function (data) {
    /*
    var valid;
    data.filter(function(este, i) {
      if(data.indexOf(este) == i) {
        console.log(data.indexOf(este),i);
        valid = false;
      }
    })
    if(valid == false) {
      return false;
    }*/
    var valuesSoFar = Object.create(null);
    for (var i = 0; i < data.length; ++i) {
        var value = data[i];
        if (value in valuesSoFar) {
            return true;
        }
        valuesSoFar[value] = true;
    }
    return false;
  }

  var _login = function (occupantsArray) {
    return $http.post(config.baseUrl+'/api/login.php', occupantsArray);
  }

  var _teste = function () {
    return $http.get('localhost:8000/book');
  }

  return {
    addOccupant: _addOccoupant,
    deleteOccupant: _deleteOccupant,
    checkNoRepeatedOccupant: _checkNoRepeatedOccupant,
    login: _login,
    teste: _teste,
  };

})
