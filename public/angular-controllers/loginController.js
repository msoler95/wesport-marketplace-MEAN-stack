var app = angular.module('WeSport');


app.controller ('loginCtrl', function ($scope) {
  $scope.cambiarARegister = function() {
	  	$("#myTab").tabs('select_tab', '#list-canvas2');
	  }

});

