'use strict';
angular.module('invitationsApp')
  .controller('HostsController', ['$scope', 'Host', 'Customer', '$stateParams', '$state', 'ngDialog',
    function($scope, Host, Customer, $stateParams, $state, ngDialog) {
      $scope.showHosts = false;
      $scope.message = "Loading ...";
      Host.find({
          filter: {
            where: {customerId: $stateParams.id},
            include: {relation: 'customer'}
          }
        })
        .$promise.then(
          function(response) {
            $scope.hosts = response;
            $scope.showHosts = true;
          },
          function(response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          });
      $scope.editHost = function(host) {
        $scope.host = host;
      };
      $scope.saveHost = function() {
        if (!$scope.host.customerId) {
          $scope.host.customerId = $stateParams.id;
        }
        Host.prototype$updateAttributes({
            customerId: $scope.host.customerId,
            id: $scope.host.id,
            name: $scope.host.name,
            email: $scope.host.email,
            phone: $scope.host.phone,
            photo: $scope.host.photo,
            contactName: $scope.host.contactName,
            contactTitle: $scope.host.contactTitle
          })
          .$promise.then(
            function(response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Host Saved Successfully</h3></div>' +
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
                <div><h3>Host not saved!</h3></div>' +
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
      $scope.deleteHost = function(hostId) {
        var custId = $scope.host.customerId;
        Host.deleteById({
            id: hostId
          })
          .$promise.then(
            function(response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Host Deleted Successfully</h3></div>' +
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
                <div><h3>Host not deleted!</h3></div>' +
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
    }
  ])

;
