(function () {
    'use strict';

    angular
        .module('angular-carousel-3d')
        .directive('carousel3dSlide', carousel3dSlide);

    // ==
    // == Directive 3d
    carousel3dSlide.$inject = [];

    // == HTML rendering directive
    function carousel3dSlide() {
        var carousel3dSlide = {
            require: '^carousel3d',
            restrict: 'AE',
            template: '<div class="slide-3d" ng-click="carousel3d.slideClicked($index)" ng-swipe-left="carousel3d.options.dir === \'ltr\' ? carousel3d.goPrev() : carousel3d.goNext()" ng-swipe-right="carousel3d.options.dir === \'ltr\' ? carousel3d.goNext() : carousel3d.goPrev()" ng-transclude></div>',
            replace: true,
            transclude: true,
            link: linkFunc
        };

        // ==
        // == Directive link
        // ========================================
        function linkFunc(scope, element, attrs, ctrl) {
            scope.carousel3d = ctrl;
        }

        return carousel3dSlide;
    }
})();
