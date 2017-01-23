'use strict';
angular.module('invitationsApp')
  .controller('HeaderController', ['$scope', '$state', '$location', '$rootScope', 'ngDialog', 'AuthService',
    function($scope, $state, $location, $rootScope, ngDialog, AuthService) {
      $scope.loggedIn = false;
      $scope.username = '';
      $scope.userId = '';
      if (AuthService.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthService.getUsername();
        $scope.userId = AuthService.getUserId();
      }
      $scope.openLogin = function() {
        ngDialog.open({
          template: 'views/login.html',
          scope: $scope,
          className: 'ngdialog-theme-default',
          controller: "LoginController"
        });
      };
      $scope.logOut = function() {
        AuthService.logout();
        $scope.loggedIn = false;
        $scope.username = '';
        $scope.userId = '';
        $location.path('/');
      };
      $rootScope.$on('login:Successful', function() {
        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.username = AuthService.getUsername();
        $scope.userId = AuthService.getUserId();
      });
      $rootScope.$on('registration:Successful', function() {
        $scope.loggedIn = AuthService.isAuthenticated();
        $scope.username = AuthService.getUsername();
        $scope.userId = AuthService.getUserId();
      });
      $scope.stateis = function(curstate) {
        return $state.is(curstate);
      };
      $scope.showJumbotron = $state.is('app') || $state.is('app.aboutus') || $state.is('app.contactus');
    }
  ])
  .controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthService', function($scope, ngDialog, $localStorage, AuthService) {
    $scope.loginData = $localStorage.getObject('userinfo', '{}');
    $scope.doLogin = function() {
      if ($scope.rememberMe)
        $localStorage.storeObject('userinfo', $scope.loginData);
      AuthService.login($scope.loginData);
      ngDialog.close();
    };
    $scope.openRegister = function() {
      ngDialog.open({
        template: 'views/register.html',
        scope: $scope,
        className: 'ngdialog-theme-default',
        controller: "RegisterController"
      });
    };
  }])
  .controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthService', function($scope, ngDialog, $localStorage, AuthService) {
    $scope.register = {};
    $scope.loginData = {};
    $scope.doRegister = function() {
      AuthService.register($scope.registration);
      ngDialog.close();
    };
  }])

.controller('ContactController', ['$scope', '$state', function($scope, $state) {

  //$state.go($state.current, {}, {reload: true});

  $scope.feedback = {
    mychannel: "",
    firstName: "",
    lastName: "",
    agree: false,
    email: ""
  };

  var channels = [{
    value: "tel",
    label: "Tel."
  }, {
    value: "Email",
    label: "Email"
  }];

  $scope.channels = channels;
  $scope.invalidChannelSelection = false;

  $scope.sendFeedback = function() {


    if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
      $scope.invalidChannelSelection = true;
    } else {
      $scope.invalidChannelSelection = false;
      // feedbackFactory.save($scope.feedback);
      $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
      };
      $scope.feedback.mychannel = "";
      $scope.feedbackForm.$setPristine();
    }
  };
}])

;
