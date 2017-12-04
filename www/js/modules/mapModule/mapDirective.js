angular.module('mapModule')
.directive("mapDiv", function () {
  return {
    template: "<div id='map' data-tap-disabled='true' style='height: 550px'></div>"
  }
});
