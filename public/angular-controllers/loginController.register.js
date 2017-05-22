var app = angular.module('WeSport');


app.controller ('loginCtrl.register', function ($scope,  AuthService,  $state) {

  $('#tabsi').tabs('select_tab', 'tabRegister');

  $scope.user = {
    name: '',
    password: '',
    mail: ''
    
  };
 
  $scope.signup = function() {
    AuthService.signup($scope.user).then(function(msg) {
    	Materialize.toast(msg, 3000);
      $state.go('login.login');
      
    }, function(errMsg) {
        console.log($scope.user);
        Materialize.toast(errMsg, 3000);
    });
  };

});

