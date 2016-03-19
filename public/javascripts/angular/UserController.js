var appControllers = angular.module('appControllers', []);

appControllers.controller('UserController', ['$scope', '$http', '$location', function($scope, $http, $location) {
  var token = JSON.parse(window.localStorage.getItem("token")) || undefined;
  console.log('token:');
  console.log(token);
  var scope = $scope;

  // TODO: More cleaning? Probably on server
  var validate = function(input) {
    if(input === "" || input === undefined || input === null) return false;
    else return true;
  }

  var userOp = function(endpoint, payload, form_id, success_message, redirect) {
    $http.post(endpoint, payload).
    success(function(token_package, status, headers, config) {
      if(status === 200) {
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

  this.changePassword = function(email, current_password, new_password) {
    if(!validate(email) || !validate(current_password) || !validate(new_password)) {
      toastr.error("Invalid input");
      return;
    }
    else if(token === undefined) {
      toastr.error("You need to be logged in to do that");
    }
    else {
      console.log('sending');
      userOp("/users/change-password", {token: token, email: email, current_password: current_password, new_password: new_password}, "#change-password-form", "Successfully changed password", "/logged-in");
    }
  }
}]);
