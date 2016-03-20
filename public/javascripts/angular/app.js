var app = angular.module('PrimaryApp', [
  'ngRoute',
  'appControllers'
]);

app.factory("UserService", function() {
  var logged_in = false;
  var is_google_login = false;
  var google_user = undefined;

  var updateStatus = function(new_status) {
    logged_in = new_status;
  }
  
  var updateGoogleStatus = function(new_status) {
    is_google_login = new_status;
  }

  var getLoggedIn = function() {
    return logged_in;
  }
  
  var getGoogleLoggedIn = function() {
    return is_google_login;
  }
  
  var getGoogleUser = function() {
    return google_user;
  }
  
  var setGoogleUser = function(new_user) {
    google_user = new_user;
  }

  return {
    getLoggedIn: getLoggedIn,
    getGoogleLoggedIn: getGoogleLoggedIn,
    updateStatus: updateStatus,
    updateGoogleStatus: updateGoogleStatus,
    setGoogleUser: setGoogleUser,
    getGoogleUser: getGoogleUser
  }
});

app.directive('googleSignInButton', function() {
  return {
    scope: {
      buttonId: '@',
      options: '&'
    },
    template: '<div></div>',
    link: function(scope, element, attrs) {
      var div = element.find('div')[0];
      div.id = attrs.buttonId;
      gapi.signin2.render(div.id, scope.options()); //render a google button, first argument is an id, second options
    }
  };
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
