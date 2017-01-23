'use strict';
angular.module('invitationsApp')
.controller('CustomersController', ['$scope', 'Customer', '$stateParams', '$state', 'ngDialog',
  function($scope, Customer, $stateParams, $state, ngDialog) {
    $scope.showCustomers = false;
    $scope.message = "Loading ...";
    $scope.customer = Customer.findById({id: $stateParams.id})
      .$promise.then(
        function(response) {
          $scope.customer = response;
        },
        function(response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        }
      );
    $scope.editCustomer = function(customer){
      $scope.customer = customer;
    };
    $scope.customers = Customer.find()
      .$promise.then(
        function(response) {
          $scope.customers = response;
          $scope.showCustomers = true;
        },
        function(response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        });
    $scope.saveCustomer = function() {
      Customer.prototype$updateAttributes({
        id: $scope.customer.id,
        userName: $scope.customer.userName,
        email: $scope.customer.email,
        firstName: $scope.customer.firstName,
        lastName: $scope.customer.lastName,
        photo: $scope.customer.photo
      })
      .$promise.then(
        function(response) {
          var message = '\
              <div class="ngdialog-message">\
                <div><h3>Customer Saved Successfully</h3></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button" ng-click=confirm("OK")>OK</button>\
                </div>'
          ngDialog.openConfirm({
            template: message,
            plain: 'true'
          });
          $state.reload();
        },
        function(response) {
          var message = '\
              <div class="ngdialog-message">\
                <div><h3>Customer not saved!</h3></div>' +
                '<div><p>' + response.data.error.message + '</p><p>' +
                response.data.error.name + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button" ng-click=confirm("OK")>OK</button>\
                </div>'
          ngDialog.openConfirm({
            template: message,
            plain: 'true'
          });
        }
      );
    };
  $scope.deleteCustomer = function(customerId){
      Customer.deleteById({id: customerId})
      .$promise.then(
        function(response) {
          var message = '\
              <div class="ngdialog-message">\
                <div><h3>Customer Deleted Successfully</h3></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button" ng-click=confirm("OK")>OK</button>\
                </div>'
          ngDialog.openConfirm({
            template: message,
            plain: 'true'
          });
          $state.reload();
        },
        function(response) {
          var message = '\
              <div class="ngdialog-message">\
                <div><h3>Customer not deleted!</h3></div>' +
                '<div><p>' + response.data.error.message + '</p><p>' +
                response.data.error.name + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button" ng-click=confirm("OK")>OK</button>\
                </div>'
          ngDialog.openConfirm({
            template: message,
            plain: 'true'
          });
        }
      );
  };

}])

;
