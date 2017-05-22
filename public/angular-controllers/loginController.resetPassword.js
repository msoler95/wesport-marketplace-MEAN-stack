var app = angular.module('WeSport');


app.controller ('loginCtrl.resetPassword', function ($scope, AuthService, $state, $stateParams) {


		//Fer la peticio al service per resetejar el mail	
	  $scope.resetPassword = function() {

	  	var sendNewPassword = {
	  		newPassword: $scope.password
	  	}
	    AuthService.resetPassword($stateParams.tokenId, sendNewPassword).then(function(msg) {
	      Materialize.toast(msg, 3000);
	      $state.go('login.login');
	      
	    }, function(errMsg) {
	    	Materialize.toast(errMsg, 3000);
	      
	    });
	  };

});

