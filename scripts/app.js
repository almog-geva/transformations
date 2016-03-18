'use strict';

angular.module('maskingApp', ['ngMaterial', 'angularResizable'])
    .controller('mainController', ['maskingService', function(maskingService) {
        var self = this;

        self.viewSource = false;
        self.isGlobalMasking = true;
        self.xmlContent = "";
        self.maskedContent = "";

        self.generate = function() {
            var inputHtml = htmlEditor.doc.getValue();

            // Make a call to the transformation API

            self.maskedContent = inputHtml;
            sourceEditor.doc.setValue(self.maskedContent);
            $('#previewIframe').contents().find('html').html(self.maskedContent);
        };

        var sourceEditorWrapper = $(sourceEditor.getWrapperElement());
        sourceEditorWrapper.removeClass('show-editor');

        self.toggleViewSource = function() {
            self.viewSource = !self.viewSource;
            if (self.viewSource) {
                sourceEditorWrapper.addClass('tr-show');
            }
            else {
                sourceEditorWrapper.removeClass('tr-show');
            }
        };

        function fetchXmlContent() {
            maskingService.fetch().then(function (data) {
                self.xmlContent = data;
                xmlEditor.doc.setValue(data);
            });
        }

        fetchXmlContent();
    }])
    .factory('maskingService', ['$http', function($http) {
        return {
            fetch: function() {
              return $http.get('data/transformations.xml').then(function (resp) {
                 return resp.data;
              });
            },
            html: function() {
                return $http.get('data/dummy.html').then(function (resp) {
                    return resp.data;
                });
            }
        };
    }])
    .directive('sectionHeader', function() {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'partials/section-header.html'
        };
    })
    .run(function(){

    });