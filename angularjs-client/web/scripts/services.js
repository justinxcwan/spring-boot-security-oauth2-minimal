'use strict';

angular.module('angularRestfulAuth')
    .factory('Main', ['$http', '$localStorage', function($http, $localStorage){
        var getUrl = window.location;
        var baseUrl = getUrl.protocol + "//" + getUrl.host;
        
        function changeUser(user) {
            angular.extend(currentUser, user);
        }

        function urlBase64Decode(str) {
            return decodeURIComponent(escape(atob(str)));
            // var output = str.replace('-', '+').replace('_', '/');
            // switch (output.length % 4) {
            //     case 0:
            //         break;
            //     case 2:
            //         output += '==';
            //         break;
            //     case 3:
            //         output += '=';
            //         break;
            //     default:
            //         throw 'Illegal base64url string!';
            // }
            // return window.atob(output);
        }

        function getUserFromToken() {
            var token = $localStorage.token;
            var user = {};
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
            }
            return user;
        }

        function base64Encode(input) {
             var keyStr = 'ABCDEFGHIJKLMNOP' +
                     'QRSTUVWXYZabcdef' +
                     'ghijklmnopqrstuv' +
                     'wxyz0123456789+/' +
                     '=';

             var output = "";
             var chr1, chr2, chr3 = "";
             var enc1, enc2, enc3, enc4 = "";
             var i = 0;
             
             do {
             chr1 = input.charCodeAt(i++);
             chr2 = input.charCodeAt(i++);
             chr3 = input.charCodeAt(i++);
             
             enc1 = chr1 >> 2;
             enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
             enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
             enc4 = chr3 & 63;
             
             if (isNaN(chr2)) {
             enc3 = enc4 = 64;
             } else if (isNaN(chr3)) {
             enc4 = 64;
             }
             
             output = output +
             keyStr.charAt(enc1) +
             keyStr.charAt(enc2) +
             keyStr.charAt(enc3) +
             keyStr.charAt(enc4);
             chr1 = chr2 = chr3 = "";
             enc1 = enc2 = enc3 = enc4 = "";
             } while (i < input.length);
             
             return output;
        }

        var currentUser = getUserFromToken();

        return {
            save: function(data, success, error) {
                $http.post(baseUrl + '/signin', data).success(success).error(error)
            },
            signin: function(data, success, error) {
                data.client_id = 'trusted';
                data.client_secret = 'secret'; 
                data.grant_type = 'password';
                data.scope = 'read write';

                var encoded = base64Encode(data.client_id + ':' + data.client_secret);

                var options = angular.extend({
                                headers: {
                                    "Authorization": 'Basic ' + encoded,
                                    "Content-Type": "application/x-www-form-urlencoded"
                                }
                            }, {});

                $http({
                    method: 'POST',
                    url: baseUrl + '/uaa/oauth/token',
                    headers: options.headers,
                    transformRequest: function(obj) {
                        var str = [];
                        for(var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: data
                }).success(success).error(error)
            },
            me: function(success, error) {
                $http.get(baseUrl + '/account/me').success(success).error(error)
            },
            logout: function(success) {
                changeUser({});
                delete $localStorage.token;
                success();
            }
        };
    }
]);
