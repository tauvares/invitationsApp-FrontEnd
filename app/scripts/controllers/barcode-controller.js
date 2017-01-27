'use strict';
angular.module('invitationsApp')
    .controller('BarcodeController', ['$scope', 'Guest', '$stateParams', '$state', 'ngDialog',
        function($scope, Guest, $stateParams, $state, ngDialog) {
            $scope.message = "Loading ...";
            $scope.options = {
                width: 2,
                height: 100,
                quite: 10,
                displayValue: true,
                font: "monospace",
                textAlign: "center",
                fontSize: 12,
                backgroundColor: "",
                lineColor: "#000"
            };

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
            $scope.printConfirmation = function() {

            };
            //---------------------------------Barcode code ---------------------------
            $scope.bc = {
                    format: 'CODE128',
                    lineColor: '#000000',
                    width: 2,
                    height: 100,
                    displayValue: true,
                    fontOptions: '',
                    font: 'monospace',
                    textAlign: 'center',
                    textPosition: 'bottom',
                    textMargin: 2,
                    fontSize: 20,
                    background: '#ffffff',
                    margin: 0,
                    marginTop: undefined,
                    marginBottom: undefined,
                    marginLeft: undefined,
                    marginRight: undefined,
                    valid: function(valid) {}
                };
                //----------------------------END-----Barcode code ---------------------------



        }
    ])

;
