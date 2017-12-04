//angular.module('mike', ['ionic', 'starter.controllers', 'starter.services', 'registerModule', 'loginModule', 'toastModule'])
angular.module('mike')
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'registerCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('map', {
    url: '/map',
    templateUrl: 'templates/map.html',
    controller: 'mapCtrl'
  })

  $urlRouterProvider.otherwise('/register');
  //$urlRouterProvider.otherwise('/login');

});
