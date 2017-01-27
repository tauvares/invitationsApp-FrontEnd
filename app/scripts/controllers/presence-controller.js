'use strict';
angular.module('invitationsApp')
  .controller('PresenceController', ['$scope', 'Guest', 'Event', '$stateParams', '$state', 'ngDialog',
    function($scope, Guest, Event, $stateParams, $state, ngDialog) {
      $scope.showGuests = false;
      $scope.message = "Loading ...";
      Event.findById({
          id: $stateParams.id,
          //filter: {include: {relation: 'host'}}
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
      $scope.editGuest = function(guest) {
        $scope.guest = guest;
      };
      $scope.saveGuest = function() {
        if (!$scope.guest.eventId) {
          $scope.guest.eventId = $stateParams.id;
        }
        Guest.prototype$updateAttributes({
            eventId: $scope.guest.eventId,
            id: $scope.guest.id,
            name: $scope.guest.name,
            email: $scope.guest.email,
            phone: $scope.guest.phone,
            photo: $scope.guest.photo,
            status: $scope.guest.status,
            invitationsConfirmed: $scope.guest.invitationsConfirmed
          })
          .$promise.then(
            function(response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Guest Saved Successfully</h3></div>' +
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
                <div><h3>Guest not saved!</h3></div>' +
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
      };
      $scope.deleteGuest = function(guestId) {
        var eventId = $scope.guest.eventId;
        Guest.deleteById({
            id: guestId
          })
          .$promise.then(
            function(response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Guest Deleted Successfully</h3></div>' +
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
                <div><h3>Guest not deleted!</h3></div>' +
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
      };

      $scope.inviteGuest = function(guest) {
        //Update Status
        $scope.guest = guest;
        $scope.guest.status = 'To Be Confirmed';
        $scope.saveGuest();

        var invitation = {
          hostname:"João Tavares",
          hostemail:"joaos@mpdft.mp.br",
          guestname:"filho segundo",
          guestemail:"tauvares@gmail.com",
          eventname:"Encontro da rede CEMA de instituições",
          eventdescription:"Encontro da rede CEMA de instituições, que ocorrerá no dia 08/02/17",
          hostaddress:"ED SEDE DO MPDFT",
          hostphone:"3343-9500",
          confirmationlink:"www.uol.com.br",
          eventphoto:"MPDFT.png"
        };
        //and send e-mail for the guest
        Guest.sendEmail(invitation);
      };

    }
  ])

;
