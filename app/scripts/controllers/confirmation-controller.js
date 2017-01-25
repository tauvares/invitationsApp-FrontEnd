'use strict';
angular.module('invitationsApp')
  .controller('ConfirmationController', ['$scope', 'Guest', '$stateParams', '$state', 'ngDialog',
    function($scope, Guest, $stateParams, $state, ngDialog) {
      $scope.message = "Loading ...";
      Guest.findById({
          id: $stateParams.id,
          filter: {
            include: {
              relation: 'event',
              scope: { // further filter the host object
                include: {
                  relation: 'host'
                }
              }
            }
          }
        })
        .$promise.then(
          function(response) {
            $scope.guest = response;
          },
          function(response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          }
        );
      $scope.submitConfirmation = function() {
        Guest.prototype$updateAttributes({
            eventId: $scope.guest.eventId,
            id: $scope.guest.id,
            name: $scope.guest.name,
            email: $scope.guest.email,
            phone: $scope.guest.phone,
            photo: $scope.guest.photo,
            status: 'Confirmed',
            invitationsConfirmed: $scope.guest.invitationsConfirmed
          })
          .$promise.then(
            function(response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Guest confirmed Successfully</h3></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button" ng-click=confirm("OK")>OK</button>\
                </div>'
              ngDialog.openConfirm({
                template: message,
                plain: 'true'
              });
              //$state.reload();
              $state.go('app.barcode', {id: $stateParams.id}, {});
            },
            function(response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Guest not confirmed!</h3></div>' +
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
