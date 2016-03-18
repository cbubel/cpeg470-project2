(function () {
  var app = angular.module('PrimaryApp');
  var token = JSON.parse(window.localStorage.getItem("token")) || undefined;

  app.controller('Controller', ['$scope', '$http', function($scope, $http) {
    var app = this;
    var scope = $scope;

    // TODO: More cleaning? Probably on server
    var validate = function(input) {
      if(input === "" || input === undefined || input === null) return false;
      else return true;
    }

    this.register = function(email, password) {
      if(!validate(email) || !validate(password)) return;

      $http.post('/users/', {email: email, password: password}).
      success(function(token_package, status, headers, config) {
        if(status === 200) {
          token = token_package;
          window.localStorage.setItem("token", JSON.stringify(token));
          document.querySelector("#registration-form").reset();
          toastr.success("Successfully registered");
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

    this.login = function(email, password) {
      if(!validate(email) || !validate(password)) return;

      $http.post('/users/login', {email: email, password: password}).
      success(function(token_package, status, headers, config) {
        if(status === 200) {
          token = token_package;
          window.localStorage.setItem("token", token);
        }
      }).
      error(function(data, status, headers, config) {
        console.log(data);
      });
    }
  }]);
})();
