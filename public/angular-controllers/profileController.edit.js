var app = angular.module('WeSport');


app.controller('profileCtrl.edit', function($scope, UserService, AuthService) {
    $scope.languagesSelect = ['Español', 'Italiano', 'Ingles'];
    $scope.languageChips = [];
    $scope.userInfo = {
        name: '',
        surname: '',
        gender: false,
        birthday: '',
        avatar: ''
    }
    $scope.imagenAvatar = "images/invitado.png";

    $scope.addLanguange = function(lan) {
        $scope.languageChips.push(lan);
    }

    $scope.deleteLanguange = function(index) {
        $scope.languageChips.splice(index);
    }

    UserService.getInfo().then(function(info) {

        $scope.userInfo = {
            name: info.name || '',
            surname: info.surname || ''
        }
        if(info.birthday)
        	$scope.userInfo.birthday =  new Date(info.birthday);
        if (info.gender != null) {
            if (info.gender == 'boy'){
            	  $scope.userInfo.gender = false;
            }
              
            else if(info.gender == 'girl'){
        		$scope.userInfo.gender = true;
            }
        }
        if(info.contact) $scope.userInfo.contact = info.contact;
        $scope.imagenAvatar = info.avatar;


    }, function(errMsg) {
        Materialize.toast(errMsg, 3000);

    });

    //  UserService.getPhoto().then(function(photo) {
    //     var img = photo.data;
    //     console.log(img)
    //     $scope.imagenAvatar = img.src.data;
    //    console.log(photo);
       

    // }, function(errMsg) {
    //     Materialize.toast(errMsg, 3000);

    // });

    $scope.updateInfo = function(){
        var file = $scope.myFile;
        var userInfo = $scope.userInfo;
        UserService.updateInfo(userInfo, file).then(function(result) {
            $scope.imagenAvatar = result.img;
            AuthService.editUserNameOrAvatar($scope.userInfo.name, result.img);
            Materialize.toast(result.msg, 3000);

        }, function(errMsg) {
            Materialize.toast(errMsg, 3000);

        });
    }

   

});

//For adding filesº
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);