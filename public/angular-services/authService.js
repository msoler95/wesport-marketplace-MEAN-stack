angular.module('WeSport')

.service('AuthService', function($q, $http, API_ENDPOINT, $rootScope) {
    var LOCAL_TOKEN_KEY = 'yourTokenKey';
    var LOCAL_USER_NAME = 'NAME';
    var LOCAL_USER_AVATAR = 'AVATAR';
    var isAuthenticated = false;
    $rootScope.isAuthenticated = false;
    $rootScope.nombreUsuario = 'Inicia sesión';
    $rootScope.redirectNombreUsuario = 'login.login';
    var authToken;

    function loadUserCredentials() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);

        if (token) {
            var name = window.localStorage.getItem(LOCAL_USER_NAME);
            var avatar = window.localStorage.getItem(LOCAL_USER_AVATAR);
            useCredentials(token, name, avatar);
            console.log(name)
            console.log(avatar)
            console.log(token)
        } else userInvitadoCredentials();

    }

    function userInvitadoCredentials() {
        $rootScope.nombreUsuario = 'Inicia sesión';
        $rootScope.avatarUsuario = 'images/invitado.png'
    }

    function storeUserCredentials(token, name, avatar, rememberme) {
        if (rememberme) {
            window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
            window.localStorage.setItem(LOCAL_USER_NAME, name);
            if (avatar === undefined) avatar = 'images/invitado.png';
            window.localStorage.setItem(LOCAL_USER_AVATAR, avatar);
        }

        useCredentials(token, name, avatar);
    }

    function editUserNameOrAvatar(name, avatar, telefono) {
        if (name !== null) {
            window.localStorage.setItem(LOCAL_USER_NAME, name);
            $rootScope.nombreUsuario = name;
        }
        console.log('avatarService: ' + avatar)
        if (avatar !== undefined) {
            window.localStorage.setItem(LOCAL_USER_AVATAR, avatar);
            $rootScope.avatarUsuario = avatar;
        }

    }

    function useCredentials(token, name, avatar) {
        isAuthenticated = true;
        $rootScope.isAuthenticated = true;
        $rootScope.redirectNombreUsuario = 'profile.edit';
        authToken = token;

        if (name !== undefined) {
            console.log(name);
            $rootScope.nombreUsuario = name;
        } else $rootScope.nombreUsuario = 'Inicia sesión';
        console.log(avatar);
        if (avatar === undefined) {
            $rootScope.avatarUsuario = 'images/invitado.png';
            console.log('hola')
        } else $rootScope.avatarUsuario = avatar;
        console.log('Avatar usuario: ' + $rootScope.avatarUsuario)

        // Set the token as header for your requests!
        $http.defaults.headers.common.Authorization = authToken;
    }

    function destroyUserCredentials() {
        console.log('bye')
        authToken = undefined;
        isAuthenticated = false;
        $rootScope.isAuthenticated = false;
        $http.defaults.headers.common.Authorization = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
        window.localStorage.removeItem(LOCAL_USER_NAME);
        window.localStorage.removeItem(LOCAL_USER_AVATAR);
        $rootScope.nombreUsuario = 'Inicia sesión';
        $rootScope.redirectNombreUsuario = 'login.login';
        $rootScope.avatarUsuario = 'images/invitado.png'
    }

    var signup = function(user) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + '/user/register', user).then(function(result) {
                if (result.data.success) {
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };

    var login = function(user, rememberme) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + '/authenticate', user).then(function(result) {
                if (result.data.success) {
                    var token = 'bearer ' + result.data.token;
                    console.log(token);
                    storeUserCredentials(token, result.data.name, result.data.avatar, rememberme);
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };



    var logout = function() {
        destroyUserCredentials();
    };


    loadUserCredentials();

    //User password
    var sendResetPassword = function(mail) {
        var sendMail = {
            mail: mail
        }
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + '/resetPassword', sendMail).then(function(result) {
                if (result.data.success) {

                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };

    var resetPassword = function(token, password) {

        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + '/resetPassword/'+ token, password).then(function(result) {
                if (result.data.success) {

                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };


    return {
        login: login,
        signup: signup,
        logout: logout,
        editUserNameOrAvatar: editUserNameOrAvatar,
        sendResetPassword: sendResetPassword,
        resetPassword: resetPassword,
        isAuthenticated: function() {
            return isAuthenticated; },
    };
})

.factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS) {
    return {
        responseError: function(response) {
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
            }[response.status], response);
            return $q.reject(response);
        }
    };
})

.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});