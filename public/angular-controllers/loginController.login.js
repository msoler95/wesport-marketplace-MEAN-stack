var app = angular.module('WeSport');


app.controller ('loginCtrl.login', function ($scope, AuthService, $state) {

	$scope.hi = "hello from login controller";

	
	  $scope.login = function() {
	    AuthService.login($scope.user, true).then(function(msg) {
	      Materialize.toast(msg, 3000);
	      $state.go('search.search');
	      
	    }, function(errMsg) {
	    	Materialize.toast(errMsg, 3000);
	      
	    });
	  };

});

