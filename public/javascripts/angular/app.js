var app = angular.module('PrimaryApp', [
  'ngRoute',
  'appControllers'
]);

app.factory("UserService", function() {
  var logged_in = false;

  var updateStatus = function(new_status) {
    logged_in = new_status;
  }

  var getLoggedIn = function() {
    return logged_in;
  }

  return {
    getLoggedIn: getLoggedIn,
    updateStatus: updateStatus
  }
});

app.config(['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {
  $routeProvider.
    when('/logged-in', {
      templateUrl: 'partials/logged-in.html',
      controller: 'UserController as userCtrl'
    }).
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
      templateUrl: 'partials/logged-in.html',
      controller: 'UserController as userCtrl'
    }).
    otherwise({
      redirectTo: "/logged-in",
      controller: 'UserController as userCtrl'
    });

    // TODO: Figure out how to get refreshes to work
    // Just local problem?
    // $locationProvider.html5Mode(true);
}]);
