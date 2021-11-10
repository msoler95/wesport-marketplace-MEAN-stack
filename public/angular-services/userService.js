angular.module('WeSport')
 
.service('UserService', function($q, $http, API_ENDPOINT, $rootScope) {

 
  var getInfo = function() {
    return $q(function(resolve, reject) {
      $http.get(API_ENDPOINT.url + '/user/getInfo').then(function(result) {
        if (result.data.success) {
          resolve(result.data.info);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };

  var getPhoto = function() {
    return $q(function(resolve, reject) {
      $http.get(API_ENDPOINT.url + '/user/getPhoto').then(function(result) {
        if (result) {
          resolve(result);
        } else {
          reject('Error');
        }
      });
    });
  };

  var getPhone = function() {
    return $q(function(resolve, reject) {
      $http.get(API_ENDPOINT.url + '/user/getPhone').then(function(result) {
        console.log('telefono service' + result.success + result.data.phone)
        if (result.data.success) {
          resolve(result.data.phone);
        } else {
          reject('Error');
        }
      });
    });
  };




  var updateInfo = function(newUserInfo, newProfilePhoto) {
    return $q(function(resolve, reject) {
      //upload info
      $http.post(API_ENDPOINT.url + '/user/updateInfo', newUserInfo).then(function(result) {
        if (result.data.success) {
          //upload avatar
          if(newProfilePhoto) {
              var fd = new FormData();
              fd.append('file', newProfilePhoto);
              $http.post(API_ENDPOINT.url + '/user/updatePhoto', fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
              })
              .then(function(result2) {
                if (result2.data.success) {
                  console.log('service ' + result2.data.img)
                  resolve({msg: result2.data.msg, img: result2.data.img});
                } else {
                  reject({msg: result2.data.msg});
                }
              });
          }
          else {
            resolve({msg: result.data.msg});
          }
         
        } else {
          reject({msg: result2.data.msg});
        }
      });
    });
  };




  return {
    getInfo: getInfo,
    updateInfo: updateInfo,
    getPhoto: getPhoto,
    getPhone: getPhone
  };
  
});