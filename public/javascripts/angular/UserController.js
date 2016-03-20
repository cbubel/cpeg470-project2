var appControllers = angular.module('appControllers', []);

appControllers.controller('UserController', ['$scope', '$http', '$location', 'UserService', function($scope, $http, $location, UserService) {
  var token = JSON.parse(window.localStorage.getItem("token")) || undefined;
  UserService.updateStatus(token !== undefined);
  this.is_google = false;
  if(typeof token === "string") {
    UserService.updateGoogleStatus(true);
    this.is_google = true;
  }
  this.logged_in = UserService.getLoggedIn();
  // console.log('token:');
  // console.log(token);
  if(token === undefined) {
    if($location.$$path === "/logged-in" || $location.$$path === "/change-password") $location.path("/login");
  }
  else if($location.$$path !== "/change-password") {
    $location.path("/logged-in");
  }
  
  $scope.options = {
    "onsuccess": function(googleUser) {
      this.is_google = true;
      UserService.updateStatus(true);
      UserService.updateGoogleStatus(true);
      token = googleUser.getAuthResponse().id_token;
      window.localStorage.setItem("token", JSON.stringify(token));
      toastr.success("Successfully logged in with Google");
      $location.path("/logged-in");
    }
  }

  // TODO: More cleaning? Probably on server
  var validate = function(input) {
    if(input === "" || input === undefined || input === null) return false;
    else return true;
  }

  var userOp = function(endpoint, payload, form_id, success_message, redirect) {
    $http.post(endpoint, payload).
    success(function(token_package, status, headers, config) {
      if(status === 200) {
        UserService.updateStatus(true);
        UserService.updateGoogleStatus(false);
        token = token_package;
        window.localStorage.setItem("token", JSON.stringify(token));
        document.querySelector(form_id).reset();
        toastr.success(success_message);
        $location.path(redirect);
      }
    }).
    error(function(data, status, headers, config) {
      if(status === 400) {
        toastr.error(data);
      }
      else {
        toastr.error("Something went wrong :(");
      }
    });
  }

  this.register = function(email, password) {
    if(!validate(email) || !validate(password)) {
      toastr.error("Invalid input");
      return;
    };
    userOp("/users/", {email: email, password: password}, "#registration-form", "Successfully registered", "/logged-in");
  }

  this.login = function(email, password) {
    if(!validate(email) || !validate(password)) {
      toastr.error("Invalid input");
      return;
    };
    userOp("/users/login", {email: email, password: password}, "#login-form", "Successfully logged in", "/logged-in");
  }

  this.logout = function() {
    if(UserService.getGoogleLoggedIn()) {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut();
    }
    UserService.updateStatus(false);
    UserService.updateGoogleStatus(false);
    window.localStorage.removeItem("token");
    toastr.success("Successfully logged out");
    $location.path("/login");
  }

  // TODO: Auto logout if token invalid? what about google?
  this.changePassword = function(email, current_password, new_password) {
    if(!validate(email) || !validate(current_password) || !validate(new_password)) {
      toastr.error("Invalid input");
      return;
    }
    else if(token === undefined) {
      toastr.error("You need to be logged in to do that");
    }
    else {
      userOp("/users/change-password", {token: token, email: email, current_password: current_password, new_password: new_password}, "#change-password-form", "Successfully changed password", "/logged-in");
    }
  }
}]);
