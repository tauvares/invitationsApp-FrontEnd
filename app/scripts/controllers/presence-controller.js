'use strict';
angular.module('invitationsApp')
  .controller('PresenceController', ['$scope', 'Guest', 'Event', '$stateParams', '$state', 'ngDialog',
    function($scope, Guest, Event, $stateParams, $state, ngDialog) {
      $scope.showGuests = false;
      $scope.message = "Loading ...";
      Event.findById({
          id: $stateParams.id,
          filter: {
            include: {
              relation: 'host',
              scope: { // further filter the host object
                include: {
                  relation: 'customer'
                }
              }
            }
          }
        })
        .$promise.then(
          function(response) {
            $scope.event = response;
          },
          function(response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          }
        );
      $scope.guests = Guest.find({
          filter: {
            where: {
              eventId: $stateParams.id
            },
            include: {
              relation: 'event'
            }
          }
        })
        .$promise.then(
          function(response) {
            $scope.guests = response;
            $scope.showGuests = true;
          },
          function(response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          });

      $scope.confirmGuestPresence = function(guestid) {
        //the warning variable is used to know if the host is inviting only one guest or the entire list
        /*
        if (!$scope.guest.eventId) {
          $scope.guest.eventId = $stateParams.id;
        };
        */
        Guest.find({
            filter: {
              where: {
                id: guestid
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
        if ($scope.guest){
        Guest.prototype$updateAttributes({
            eventId: $scope.guest.eventId,
            id: $scope.guest.id,
            name: $scope.guest.name,
            email: $scope.guest.email,
            phone: $scope.guest.phone,
            photo: $scope.guest.photo,
            status: 'Presence Confirmed',
            invitationsConfirmed: $scope.guest.invitationsConfirmed
          })
          .$promise.then(
            function(response) {

                var message = '\
                <div class="ngdialog-message">\
                  <div><h3>Guest Confirmed Presence Successfully</h3></div>' +
                  '<div class="ngdialog-buttons">\
                      <button type="button" class="ngdialog-button" ng-click=confirm("OK")>OK</button>\
                  </div>';
                ngDialog.openConfirm({
                  template: message,
                  plain: 'true'
                });
                $state.reload();

            },
            function(response) {

                var message = '\
                <div class="ngdialog-message">\
                  <div><h3>Guest dont confirmed presence!</h3></div>' +
                  '<div><p>' + response.data.error.message + '</p><p>' +
                  response.data.error.name + '</p></div>' +
                  '<div class="ngdialog-buttons">\
                      <button type="button" class="ngdialog-button" ng-click=confirm("OK")>OK</button>\
                  </div>';
                ngDialog.openConfirm({
                  template: message,
                  plain: 'true'
                });

            }
          );
        }
      };

    }
  ])
;
