/*!
 * angular-carousel-3d
 * 
 * Version: 0.0.6
 * License: MIT
 */


(function () {
    'use strict';

    angular
        .module('angular-carousel-3d')
        .directive('carousel3d', carousel3d);

    // ==
    // == Directive 3d
    // ========================================
    carousel3d.$inject = ['$timeout'];

    function carousel3d($timeout) {

        var carousel3d = {
            restrict: 'AE',
            template: '' +
            '<div class=\"carousel-3d-container\" ng-switch="vm.isLoading">' +
            '   <div class="carousel-3d-loader" ng-switch-when=\"true\">' +
            '       <div class=\"carousel-3d-loader-circle\" style=\"-webkit-transform:scale(0.75)\"><div><div></div><div></div></div></div>' +
            '       <div class="carousel-3d-loader-percentage">{{ vm.percentLoaded }}</div>' +
            '   </div>' +
            '   <div ng-switch-when="false" ng-switch="vm.isSuccessful">' +
            '       <div class=\"carousel-3d\" ng-switch-when=\"true\" ng-show="vm.isRendered">' +
            '           <img ng-repeat=\"image in vm.slides track by $index\" ng-src=\"{{image[vm.sourceProp]}}\" class=\"slide-3d\" ng-click=\"vm.slideClicked($index)\" ng-swipe-left=\"vm.goPrev()\" ng-swipe-right=\"vm.goNext()\">' +
            '       </div>' +
            '       <p ng-switch-when=\"false\" class="carousel-3d-loader-error">There was a problem during load</p>' +
            '   </div>' +
            '</div>',
            replace: true,
            scope: {
                model: '=ngModel',
                options: '=',
                onSelectedClick: '&',
                onSlideChange: '&',
                onLastSlide: '&',
                onBeforeChange: '&'
            },
            controller: 'Carousel3dController as vm',
            bindToController: true,
            transclude: true,
            compile: compileFunc,
            link: linkFunc
        };

        // ==
        // == Directive Compile
        // =======================================
        //compileFunc.$inject = ['element', 'attributes', '$attrs'];

        function compileFunc(element, attributes) {

            return (linkFunc);
        }

        // ==
        // == Directive link
        // ========================================

        function linkFunc(scope, element, attrs, ctrl, transclude) {
        }

        return carousel3d;
    }

})();