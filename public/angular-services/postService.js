angular.module('WeSport')

.service('PostService', function($q, $http, API_ENDPOINT, $rootScope) {


    var getUserPosts = function() {
        return $q(function(resolve, reject) {
            $http.get(API_ENDPOINT.url + '/posts/getPersonalPosts').then(function(result) {
                if (result.data.success) {
                    resolve(result.data.posts);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };

    var createPost = function(post) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + '/posts/createPost', post).then(function(result) {
                if (result.data.success) {
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };

    var getTelefonOfPost = function(id_post) {

        var post = {
            "id_post": id_post
        }
        console.log('!!! ' + post.id_post)
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + '/posts/getTelefonOfPost', post).then(function(result) {
                if (result.data.success) {
                    console.log(result.data.tlf)
                    resolve(result.data.tlf);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };


    var getUserPosts = function() {
        return $q(function(resolve, reject) {
            $http.get(API_ENDPOINT.url + '/posts/getPersonalPosts').then(function(result) {
                if (result.data.success) {
                    resolve(result.data.posts);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };

    var getAllPosts = function() {
        return $q(function(resolve, reject) {
            $http.get(API_ENDPOINT.url + '/posts/getAllPosts').then(function(result) {
                if (result.data.success) {
                    resolve(result.data.posts);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };

    var deletePost = function(idPost) {
        var post = {
            "idPost": idPost
        }
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + '/posts/deletePost', post).then(function(result) {
                if (result.data.success) {
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };

    var editPost = function(post) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + '/posts/updatePost', post).then(function(result) {
                if (result.data.success) {
                    resolve(result.data.msg);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };

    var getPostsByLocation = function(coord) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + '/posts/getPostsByLocation', coord).then(function(result) {
                if (result.data.success) {
                    resolve(result.data.posts);
                } else {
                    reject(result.data.msg);
                }
            });
        });
    };

    return {
        getUserPosts: getUserPosts,
        createPost: createPost,
        getAllPosts: getAllPosts,
        getTelefonOfPost: getTelefonOfPost,
        deletePost: deletePost,
        editPost: editPost,
        getPostsByLocation: getPostsByLocation
    };

});