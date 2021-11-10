var app = angular.module('WeSport', ['ui.router', 'ngFlag', 'ngRateIt']);

app.config(function($stateProvider, $urlRouterProvider){

 
        $stateProvider
            .state( 'search' , {        //Control search/work tabs
                  templateUrl: 'angular-views/searchView.html',
                  controller: 'searchCtrl'  
            })
             .state('search.search', {   //Control search view
            	url: "/app",
            	templateUrl: 'angular-views/searchView.search.html',
            	controller: 'searchCtrl.search'   
            })
            .state('search.work', { //Control work view
            	templateUrl: 'angular-views/searchView.work.html',
            	controller: 'searchCtrl.work'  
            })
            .state('search.worknotLogged', { //Control work view
              templateUrl: 'angular-views/searchView.work.notLogged.html'
            })
            .state( 'login' , {     //Control login/register tabs
                  templateUrl: 'angular-views/login.html',
                  controller: 'loginCtrl'   
            })
            .state( 'login.login' , {   //Control login view
                  templateUrl: 'angular-views/login.login.html',
                  controller: 'loginCtrl.login'  
            })
            .state( 'login.register' , {    //Control register view
                  templateUrl: 'angular-views/login.register.html',
                  controller: 'loginCtrl.register'  
            })
            .state( 'login.dontRememberPassword' , {    //Per enviar mail per resetejar contraseña
                  templateUrl: 'angular-views/login.dontRememberPassword.html',
                  controller: 'loginCtrl.dontRememberPassword'  
            })
            .state( 'login.resetPassword' , {     //Per resetejar contraseña
                  templateUrl: 'angular-views/login.resetPassword.html',
                  controller: 'loginCtrl.resetPassword',
                  url: '/resetMyPassword/:tokenId',
            })
            .state( 'profile' , {    //Control register view
                  templateUrl: 'angular-views/profile.html'
            })
            // .state( 'profile.profile' , {    //Control register view
            //       templateUrl: 'angular-views/profile.profile.html'
            // })
            .state( 'profile.edit' , {    //Control register view
                  templateUrl: 'angular-views/profile.edit.html',
                   controller: 'profileCtrl.edit'  
            });

            
        $urlRouterProvider.otherwise("/app");

});

app.controller('mainCtrl', function($scope, $rootScope, AuthService, $state, AUTH_EVENTS) {
	$scope.menuOn = false;	

     
      $scope.logout = function() {
        AuthService.logout();
        Materialize.toast('Se ha cerrado sesión', 3000);
        $state.go('login.login');
      };

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    Materialize.toast('Ha habido un error, vuelve a Iniciar sesión', 3000, 'rounded');
    $state.go('login.login');
  });

  //TABS from left menu
  $rootScope.aprenderSelected = 'menu-active';
  $rootScope.loginSelected = '';
  $rootScope.profileSelected = '';

  $scope.closeMenu = function() {
     $('.button-collapse').sideNav('hide');
  }


});

app.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    
    //Tabs
    if(next.name === 'search.search' || next.name === 'login.work') {
      $rootScope.aprenderSelected = 'menu-active';
      $rootScope.loginSelected = '';
      $rootScope.profileSelected = '';
      $('ul.tabs').tabs();
      if(next.name === 'search.search')  $('ul.tabs').tabs('select_tab', 'test1');
      if(next.name === 'login.work')  $('ul.tabs').tabs('select_tab', 'test2');
    }
    else if (next.name === 'login.login' || next.name === 'login.register') {
      $rootScope.aprenderSelected = '';
      $rootScope.loginSelected = 'menu-active';
      $rootScope.profileSelected = '';
      $('ul.tabs').tabs();
      if(next.name === 'login.login')  $('ul.tabs').tabs('select_tab', 'test1');
      if(next.name === 'login.register')  $('ul.tabs').tabs('select_tab', 'test2');
      
      
    }
    else if (next.name === 'profile.profile' || next.name === 'profile.edit') {
      $rootScope.aprenderSelected = '';
      $rootScope.loginSelected = '';
      $rootScope.profileSelected = 'menu-active';
    }

    //Autentication middleware for routes
    if (!AuthService.isAuthenticated()) {
      if (next.name === 'search.work') {
        event.preventDefault();
        $state.go('search.worknotLogged');
      }
    }
  });
});



