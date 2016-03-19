var app = angular.module('PrimaryApp', [
  'ngRoute',
  'appControllers'
]);

app.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
    when('/register', {
      templateUrl: 'partials/register.html',
      controller: 'UserController as userCtrl'
    }).
    when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'UserController as userCtrl'
    }).
    when('/change-password', {
      templateUrl: 'partials/change-password.html',
      controller: 'UserController as userCtrl'
    }).
    when('/logged-in', {
      templateUrl: 'partials/logged-in.html'
    }).
    otherwise({
      redirectTo: '/index'
    });
}]);
