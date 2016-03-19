var app = angular.module('PrimaryApp', [
  'ngRoute',
  'appControllers'
]);

app.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
    when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'UserController'
    }).
    when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'UserController'
    }).
    when('/change-password', {
      templateUrl: 'partials/change-password.html',
      controller: 'UserController'
    }).
    otherwise({
      redirectTo: '/index'
    });
}]);
