'use strict';

/* Controllers */

angular.module('angularRestfulAuth')
    .controller('HomeCtrl', ['$rootScope', '$scope', '$location', '$localStorage', 'Main', function($rootScope, $scope, $location, $localStorage, Main) {

        $scope.signin = function() {
            var formData = {
                username: $scope.username,
                password: $scope.password
            }

            Main.signin(formData, function(res) {
                if (res.access_token === undefined) {
                    alert(res)    
                } else {
                    $localStorage.token = res.access_token;
                    window.location = "/web";    
                }
            }, function() {
                $rootScope.error = 'Failed to signin';
            })
        };

        $scope.signup = function() {
            var formData = {
                email: $scope.email,
                password: $scope.password
            }

            Main.save(formData, function(res) {
                if (res.type == false) {
                    alert(res.data)
                } else {
                    $localStorage.token = res.data.token;
                    window.location = "/web"    
                }
            }, function() {
                $rootScope.error = 'Failed to signup';
            })
        };

        $scope.me = function() {
            Main.me(function(res) {
                $scope.myDetails = res;
            }, function() {
                $rootScope.error = 'Failed to fetch details';
            })
        };

        $scope.logout = function() {
            Main.logout(function() {
                window.location = "/web"
            }, function() {
                alert("Failed to logout!");
            });
        };
        $scope.token = $localStorage.token;
    }])

.controller('MeCtrl', ['$rootScope', '$scope', '$location', 'Main', function($rootScope, $scope, $location, Main) {

        Main.me(function(res) {
            $scope.myDetails = res;
        }, function() {
            $rootScope.error = 'Failed to fetch details';
        })
}]);
