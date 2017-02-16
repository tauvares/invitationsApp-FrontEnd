'use strict';
angular.module('invitationsApp')
  .controller('EventsController', ['$scope', 'Event', 'Host', '$stateParams', '$state', 'ngDialog',
    function($scope, Event, Host, $stateParams, $state, ngDialog) {
      $scope.showEvents = false;
      $scope.message = "Loading ...";
      
      Host.findById({
          id: $stateParams.id,
          filter: {include: {relation: 'customer'}}
        })
        .$promise.then(
          function(response) {
            $scope.host = response;
          },
          function(response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          }
        );
      Event.find({
          filter: {
            where: {hostId: $stateParams.id},
            include: {relation: 'host'}
          }
        })
        .$promise.then(
          function(response) {
            $scope.events = response;
            $scope.showEvents = true;
          },
          function(response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
          });
      $scope.editEvent = function(event){
        $scope.event = event;
      };
      $scope.saveEvent = function() {
        if (!$scope.event.hostId) {
          $scope.event.hostId = $stateParams.id;
        }
        Event.prototype$updateAttributes({
              hostId: $scope.event.hostId,
              id: $scope.event.id,
              name: $scope.event.name,
              address: $scope.event.address,
              startDate: $scope.event.startDate,
              endDate: $scope.event.endDate,
              confirmationDeadlineDate: $scope.event.confirmationDeadlineDate,
              description: $scope.event.description,
              photo: $scope.event.photo
          })
          .$promise.then(
            function(response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Event Saved Successfully</h3></div>' +
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
                <div><h3>Event not saved!</h3></div>' +
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
      $scope.deleteEvent = function(eventId) {
        var hostId = $scope.event.hostId;
        Event.deleteById({id: eventId})
          .$promise.then(
            function(response) {
              var message = '\
              <div class="ngdialog-message">\
                <div><h3>Event Deleted Successfully</h3></div>' +
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
                <div><h3>Event not deleted!</h3></div>' +
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

    }
  ])

;
