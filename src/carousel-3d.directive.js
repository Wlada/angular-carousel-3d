(function () {
    'use strict';

    angular
        .module('angular-carousel-3d')
        .directive('carousel3d', carousel3d);


    // ==
    // == Directive 3d
    carousel3d.$inject = ['$timeout'];

    function carousel3d() {

        var carousel3d = {
            restrict: 'AE',
            template: '' +
            '<div class="carousel-3d-container" ng-switch="vm.isLoading" ng-mouseenter="vm.autoRotationLocked=true" ng-mouseleave="vm.autoRotationLocked=false">' +
            '   <div class="carousel-3d-loader" ng-switch-when="true">' +
            '       <div class="carousel-3d-loader-circle" style="-webkit-transform:scale(0.75)"><div><div></div><div></div></div></div>' +
            '       <div class="carousel-3d-loader-percentage">{{ vm.percentLoaded }}</div>' +
            '   </div>' +
            '   <div ng-switch-when="false" ng-switch="vm.isSuccessful">' +
            '       <div class="carousel-3d" ng-switch-when="true" ng-show="vm.isRendered" ng-transclude>' +
            '       </div>' +
            '       <p ng-switch-when="false" class="carousel-3d-loader-error">There was a problem during load</p>' +
            '       <div ng-if="vm.controls" class="carousel-3d-controls">' +
            '           <div class="carousel-3d-next arrow-left" ng-click="vm.options.dir === \'ltr\' ? vm.goNext() : vm.goPrev()"></div>' +
            '           <div class="carousel-3d-prev arrow-right" ng-click="vm.options.dir === \'ltr\' ? vm.goPrev() : vm.goNext()"></div>' +
            '       </div>' +
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
            controller: 'Carousel3dController',
            controllerAs: 'vm',
            bindToController: true,
            transclude: true
        };

        return carousel3d;
    }

})();
