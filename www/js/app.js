/*  Author: Raphael Vizoni do Prado
*   Contact: ravizoni@gmail.com
*   Date:  30/08/2016
*/

angular.module('mike',
['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'registerModule', 'loginModule',
'toastModule', 'localStorageModule', 'markerModule', 'mapModule', 'geolocationModule', 'loadingModule',
'pushModule'])

.run(function($ionicPlatform, localStorageFactory, config, $rootScope) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    //document.addEventListener('deviceready', function () {
    var notificationOpenedCallback = function(jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      alert("entrou aqui");
    };

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      cordova.plugins.backgroundMode.enable();
      cordova.plugins.backgroundMode.setDefaults({
        title:  "Mike",
        ticker: "Ticker",
        text:   "Executando em Background.",
        icon:   "icon",
        resume: true,
        isPublic: true,
      })
    }
     window.addEventListener("offline", onOffline, false);
     function onOffline() {
      //  alert("prioridade atualizado: 0");
       localStorageFactory.setKey("onDutyStatus",0);
     }

     window.addEventListener("online", onOnline, false);
     function onOnline() {
       /* Se estava sem conexao e agora tem conexão, atualiza para patrulhando*/
       if (localStorageFactory.getKey("onDutyStatus") == 0) {
        //  alert("prioridade atualizado: 1");
         localStorageFactory.setKey("onDutyStatus",1);
       }
     }

    localStorageFactory.setKey("uuid",device.uuid);
    /*uuidB64 é para autorização da API*/
    localStorageFactory.setKey("uuidB64",Base64.encode(device.uuid));
    window.plugins.OneSignal
      .startInit(config.oneSignalAppID, config.appID)
      .handleNotificationOpened(notificationOpenedCallback)
      .endInit();
    window.plugins.OneSignal.getIds(function(ids) {
      var OneSignalParsed = JSON.parse(ids);
      localStorageFactory.setKey("onesignal_id",OneSignalParsed.userId);
    });

    /*
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        //console.log(device.cordova);
        localStorage.setItem("deviceuuid",device.uuid);
        //console.log(device.uuid);
        window.plugins.OneSignal.getIds(function(ids) {

          //console.log('getIds: ' + JSON.stringify(ids));
          //alert("userId = " + ids.userId + ", pushToken = " + ids.pushToken);
          //alert("ID OneSignal APP.JS: " + ids.userId);
          localStorage.setItem("ind_onesignal",ids.userId);
        });
        //----------------------------
        var notificationOpenedCallback = function(jsonData) {
          console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
        };
         window.plugins.OneSignal.init("7231b98b-59fc-4384-bc41-3d949dc0e84a",
                                        {googleProjectNumber: "860836112856"},
                                        notificationOpenedCallback);
        window.plugins.OneSignal.setSubscription(true);

        // Show an alert box if a notification comes in when the user is in your app.
        window.plugins.OneSignal.enableInAppAlertNotification(true);
        window.plugins.OneSignal.enableNotificationsWhenActive(true);
    }
    */
    /*---------------------------------------------------------*/

  });
})
