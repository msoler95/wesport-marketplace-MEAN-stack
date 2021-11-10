var app = angular.module('WeSport');


app.controller ('loginCtrl.dontRememberPassword', function ($scope, AuthService, $state) {


		//Fer la peticio al service per resetejar el mail	
	  $scope.sendResetPassword = function() {

	    AuthService.sendResetPassword($scope.sendMail).then(function(msg) {
	      Materialize.toast(msg, 3000);
	      $state.go('login.login');
	      
	    }, function(errMsg) {
	    	Materialize.toast(errMsg, 3000);
	      
	    });
	  };

});

