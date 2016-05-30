/*!
 * Name: angular-carousel-3d
 * GIT Page: https://github.com/Wlada/angular-carousel-3d
 * Version: 0.1.1 - 2016-05-30T20:01:50.496Z
 * License: MIT
 */


(function () {
    'use strict';

    angular
        .module('angular-carousel-3d', [
            'swipe' 
        ]);


})();
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
            template: '<div class=\"slide-3d\" ng-click=\"carousel3d.slideClicked($index)\" ng-swipe-left=\"carousel3d.goPrev()\" ng-swipe-right=\"carousel3d.goNext()\" ng-transclude></div>',
            replace: true,
            transclude: true,
            link: linkFunc
        };

        // ==
        // == Directive link
        // ========================================
        function linkFunc(scope, element, attrs, ctrl, transclude) {
            scope.carousel3d = ctrl;
        }

        return carousel3dSlide;
    }
})();
(function () {
    'use strict';

    angular
        .module('angular-carousel-3d')
        .controller('Carousel3dController', Carousel3dController);

    // ==
    // == Directive Controller
    // ========================================
    Carousel3dController.$inject = ['$scope', '$element', '$attrs', '$timeout', '$interval', '$log', '$window', 'Carousel3dService'];

    function Carousel3dController($scope, $element, $attrs, $timeout, $interval, $log, $window, Carousel3dService) {
        var vm = this;

        vm.isLoading = true;
        vm.isSuccessful = false;
        vm.isRendered = false;
        vm.percentLoaded = 0;
        vm.autoRotation = null;

        vm.slideClicked = slideClicked;
        vm.goPrev = goPrev;
        vm.goNext = goNext;

        var $wrapper = null,
            $slides = [],
            carousel3d = {};

        // == Watch changes on model and options object
        $scope.$watch('[vm.model, vm.options]', init, true);

        function init() {
            Carousel3dService
                .build(vm.model, vm.options)
                .then(
                    function handleResolve(carousel) {

                        carousel3d = carousel;

                        vm.slides = carousel3d.slides;
                        vm.controls = carousel3d.controls;
                        vm.isLoading = false;
                        vm.isSuccessful = true;

                        var outerHeight = carousel3d.getOuterHeight(),
                            outerWidth = carousel3d.getOuterWidth();

                        $element.css({'height': outerHeight + 'px'});

                        $timeout(function () {

                            $wrapper = angular.element($element[0].querySelector('.carousel-3d'));
                            $wrapper.css({'width': outerWidth + 'px', 'height': outerHeight + 'px'});
                            $slides = $wrapper.children();

                            render();
                        });

                    },
                    // == Preloaded images reject  handler
                    function handleReject(carousel) {

                        $element.css({'height': carousel.getOuterHeight() + 'px'});

                        vm.isLoading = false;
                        vm.isSuccessful = false;
                    },
                    // == Preloaded images notify handler which is executed multiple times during preload
                    function handleNotify(event) {
                        vm.percentLoaded = event.percent;
                    }
                );

        }

        function render(animate, speedTime) {
            carousel3d.setSlides();

            var outerHeight = carousel3d.getOuterHeight(),
                outerWidth = carousel3d.getOuterWidth(),
                slideTop = (carousel3d.topSpace === "auto") ? 0 : ((outerHeight / 2) - (outerHeight / 2)),
                slideLeft = ((carousel3d.width / 2) - (outerWidth / 2)),
                speed = (speedTime) ? (speedTime / 1000) : (carousel3d.animationSpeed / 1000),
                zIndex = 999;

            // == Set other slides styles
            angular.forEach(carousel3d.slides, function (slide, index) {
                var css = {
                    position: 'absolute',
                    opacity: 0,
                    visibility: 'hidden',
                    overflow: 'hidden',
                    top: slideTop + 'px',
                    'border-width': carousel3d.border + 'px',
                    width: outerWidth,
                    height: outerHeight
                };

                if (animate) {
                    angular.extend(css, {
                        '-webkit-transition': "all " + speed + "s ",
                        '-moz-transition': "all " + speed + "s ",
                        '-o-transition': "all " + speed + "s ",
                        '-ms-transition': "all " + speed + "s ",
                        'transition': "all " + speed + "s "
                    });
                }

                getSlide(index).css(css);
            });

            // == Set first slide styles
            getSlide(carousel3d.currentIndex)
                .addClass('current')
                .css({
                    zIndex: zIndex,
                    opacity: 1,
                    visibility: 'visible',
                    '-webkit-transform': 'none',
                    '-moz-transform': 'none',
                    '-o-transform': 'none',
                    '-ms-transform': 'none',
                    'transform': 'none',
                    left: slideLeft + 'px',
                    top: slideTop + 'px',
                    width: outerWidth + "px",
                    height: outerHeight + "px"
                });

            angular.forEach(carousel3d.rightSlides, function (slide, index) {
                var css = setCss(index, zIndex, true);

                zIndex -= index + 1;

                getSlide(slide)
                    .css(css)
                    .css({
                        opacity: 1,
                        visibility: 'visible',
                        zIndex: zIndex
                    });
            });

            angular.forEach(carousel3d.leftSlides, function (slide, index) {
                var css = setCss(index, zIndex);

                zIndex -= index + 1;

                getSlide(slide)
                    .css(css)
                    .css({
                        opacity: 1,
                        visibility: 'visible',
                        zIndex: zIndex
                    });
            });

            if (carousel3d.total > carousel3d.visible) {

                var rCSS = setCss(carousel3d.rightSlides.length - 1, carousel3d.rightSlides.length - 1, true),
                    lCSS = setCss(carousel3d.leftSlides.length - 1, carousel3d.leftSlides.length - 1);

                getSlide(carousel3d.rightOutSlide).css(rCSS);
                getSlide(carousel3d.leftOutSlide).css(lCSS);
            }

            if(carousel3d.autoRotationSpeed > 0) {
                vm.autoRotation = $interval(function() {
                    if(vm.dir === 'rtl') {
                        vm.goPrev();
                    } else {
                        vm.goNext();
                    }
                }, carousel3d.autoRotationSpeed);
            }
            vm.isRendered = true;
        }

        function setCss(i, zIndex, positive) {

            var leftRemain = (carousel3d.space == "auto") ? parseInt((i + 1) * (carousel3d.width / 1.5)) : parseInt((i + 1) * (carousel3d.space)),
                transform = (positive) ?
                            'translateX(' + (leftRemain) + 'px) translateZ(-' + (carousel3d.inverseScaling + ((i + 1) * 100)) + 'px) rotateY(-' + carousel3d.perspective + 'deg)' :
                            'translateX(-' + (leftRemain) + 'px) translateZ(-' + (carousel3d.inverseScaling + ((i + 1) * 100)) + 'px) rotateY(' + carousel3d.perspective + 'deg)',
                left = "0%",
                top = (carousel3d.topSpace === "auto") ? "none" : parseInt((i + 1) * (carousel3d.space)),
                width = "none",
                height = "none",
                overflow = "visible";

            return {
                '-webkit-transform': transform,
                '-moz-transform': transform,
                '-o-transform': transform,
                '-ms-transform': transform,
                'transform': transform,
                left: left,
                top: top,
                width: width,
                height: height,
                zIndex: zIndex,
                overflow: overflow
            };
        }

        function goSlide(index, motionless, farchange) {

            if (angular.isFunction(vm.onBeforeChange)) {
                vm.onBeforeChange({
                    index: carousel3d.currentIndex
                });
            }

            carousel3d.setCurrentIndex((index < 0 || index > carousel3d.total - 1) ? 0 : index);

            if (carousel3d.isLastSlide()) {

                if (angular.isFunction(vm.onLastSlide)) {
                    vm.onLastSlide({
                        index: carousel3d.currentIndex
                    });
                }
            }

            angular.forEach($slides, function (slide, index) {
                angular.element($slides[index]).removeClass('current');
            });

            carousel3d.setLock(true);

            render(true, carousel3d.animationSpeed);

            $timeout(function () {
                animationEnd();
            }, carousel3d.animationSpeed);

            return farchange;
        }

        function goNext(farchange) {

            farchange = (farchange) ? farchange : false;

            if ((!farchange && carousel3d.getLock()) || (!carousel3d.loop && carousel3d.isLastSlide())) {
                return false;
            }

            if (carousel3d.isLastSlide()) {
                goSlide(0, false, farchange);

            } else {
                goSlide(carousel3d.currentIndex + 1, false, farchange);
            }

            return false;
        }

        function goPrev(farchange) {

            farchange = (farchange) ? farchange : false;

            if ((!farchange && carousel3d.getLock()) || (!carousel3d.loop && carousel3d.isFirstSlide())) {
                return false;
            }

            if (carousel3d.isFirstSlide()) {
                goSlide(carousel3d.total - 1, false, farchange);

            } else {
                goSlide(carousel3d.currentIndex - 1, false, farchange);
            }

            return false;
        }

        function goFar(index) {
            var diff = (index === carousel3d.total - 1 && carousel3d.isFirstSlide()) ? -1 : (index - carousel3d.currentIndex);

            if (carousel3d.isLastSlide() && index === 0) {
                diff = 1;
            }

            var diff2 = (diff < 0) ? -diff : diff,
                timeBuff = 0;

            for (var i = 0; i < diff2; i++) {
                var timeout = (diff2 === 1) ? 0 : (timeBuff);

                $timeout(function () {
                    (diff < 0) ? goPrev(diff2) : goNext(diff2);
                }, timeout);

                timeBuff += (carousel3d.animationSpeed / (diff2));
            }
        }

        function animationEnd() {
            carousel3d.setLock(false);

            if (vm.onSlideChange) {
                vm.onSlideChange({
                    index: carousel3d.currentIndex
                });
            }
        }

        function getSlide(index) {
            return (index >= 0) ? angular.element($slides[index]) : angular.element($slides[carousel3d.total + index]);
        }

        function slideClicked(index) {
            $interval.cancel(vm.autoRotation);

            if (carousel3d.currentIndex != index) {

                if (!carousel3d.clicking) {
                    return false;
                } else {
                    goFar(index);
                }

            } else {
                if (vm.onSelectedClick) {
                    vm.onSelectedClick({
                        index: carousel3d.currentIndex
                    });
                }
            }
        }
    }

})();
(function () {
    'use strict';

    angular
        .module('angular-carousel-3d')
        .directive('carousel3d', carousel3d);


    // ==
    // == Directive 3d
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
            '       <div class=\"carousel-3d\" ng-switch-when=\"true\" ng-show="vm.isRendered" ng-transclude>' +
            '       </div>' +
            '       <p ng-switch-when=\"false\" class="carousel-3d-loader-error">There was a problem during load</p>' +
            '       <div ng-if="vm.controls" class="carousel-3d-controls">' +
            '           <div class="carousel-3d-next arrow-left" ng-click=\"vm.goPrev()\"></div>' +
            '           <div class="carousel-3d-prev arrow-right" ng-click=\"vm.goNext()\"></div>' +
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
(function () {
    'use strict';

    angular
        .module('angular-carousel-3d')
        .factory("Carousel3dService", Carousel3dService);

    Carousel3dService.$inject = ['$rootScope', '$q', '$log'];

    function Carousel3dService($rootScope, $q, $log) {

        function Carousel3d(slides, params) {
            this.slides = slides || [];
            this.leftSlides = [];
            this.rightSlides = [];
            this.leftOutSlide = '';
            this.rightOutSlide = '';
            this.loadCount = 0;
            this.errorCount = 0;
            this.loop = params.loop || false;
            this.clicking = params.clicking || false;
            this.states = {
                PENDING: 1,
                LOADING: 2,
                RESOLVED: 3,
                REJECTED: 4
            };
            this.total = this.slides.length;
            this.currentIndex = 0;
            this.lock = false;
            this.sourceProp = params.sourceProp;
            this.visible = params.visible || 5;
            this.perspective = params.perspective || 35;
            this.animationSpeed = params.animationSpeed || 500;
            this.dir = params.dir || 'ltr';
            this.width = params.width || 360;
            this.height = params.height || 270;
            this.border = params.border || 0;
            this.space = params.space || 'auto';
            this.topSpace = params.topSpace || 'auto';
            this.controls = params.controls || false;
            this.startSlide = params.startSlide || 0;
            this.inverseScaling = params.inverseScaling || 300;
            this.autoRotationSpeed = params.autoRotationSpeed || 0;
            this.state = this.states.PENDING;
            this.deferred = $q.defer();
            this.promise = this.deferred.promise;
        }

        // == Public  methods
        // ========================================

        Carousel3d.build = function (model, params) {
            var carousel = new Carousel3d(model, params || {});

            return carousel.load().promise.then(function () {
                carousel.visible = (carousel.visible > carousel.total) ? carousel.total : carousel.visible;

                carousel.currentIndex = carousel.startSlide > carousel.total - 1 ? carousel.total - 1 : params.startSlide;

                try {
                    if (carousel.visible !== 2) {
                        carousel.visible = (carousel.visible % 2) ? carousel.visible : carousel.visible - 1;
                    }

                } catch (error) {
                    $log.error(error);
                }

                return carousel;
            });

        };

        // == Private  methods
        // ========================================

        var proto = {
            constructor: Carousel3d,
            isInitiated: isInitiated,
            isRejected: isRejected,
            isResolved: isResolved,
            load: load,
            handleImageError: handleImageError,
            handleImageLoad: handleImageLoad,
            loadImageLocation: loadImageLocation,
            getTotalNumber: getTotalNumber,
            setStartSlide: setStartSlide,
            getSlides: getSlides,
            setSlides: setSlides,
            setCurrentIndex: setCurrentIndex,
            getOuterWidth: getOuterWidth,
            getOuterHeight: getOuterHeight,
            setLock: setLock,
            getLock: getLock,
            isLastSlide: isLastSlide,
            isFirstSlide: isFirstSlide,
            getSourceProp: getSourceProp
        };

        function isInitiated() {
            return ( this.state !== this.states.PENDING );
        }

        function isRejected() {
            return ( this.state === this.states.REJECTED );
        }

        function isResolved() {
            return ( this.state === this.states.RESOLVED );
        }

        function load() {

            if (this.isInitiated()) {
                return this;
            }


            this.state = this.states.LOADING;

            if (!this.sourceProp) {
                this.deferred.resolve(this);

            } else {
                for (var i = 0; i < this.total; i++) {
                    this.loadImageLocation(this.slides[i]);
                }
            }


            return this;
        }

        function handleImageError(imageLocation) {
            this.errorCount++;

            if (this.isRejected()) {
                return;
            }

            this.state = this.states.REJECTED;
            this.deferred.reject(this);
        }

        function handleImageLoad(imageLocation) {
            this.loadCount++;

            if (this.isRejected()) {
                return;
            }

            this.deferred.notify({
                percent: Math.ceil(this.loadCount / this.total * 100),
                imageLocation: imageLocation
            });

            if (this.loadCount === this.total) {
                this.state = this.states.RESOLVED;


                this.deferred.resolve(this);
            }
        }

        function loadImageLocation(imageLocation) {

            var carousel = this,
                image = new Image();

            image.onload = function (event) {
                $rootScope.$apply(function () {
                        carousel.handleImageLoad(event.target.src);
                        image = event = null;
                    }
                );

            };
            image.onerror = function (event) {
                $rootScope.$apply(function () {
                        carousel.handleImageError(event.target.src);
                        image = event = null;
                    }
                );
            };
            image.src = imageLocation[this.sourceProp];
        }

        function getTotalNumber() {
            return this.total;
        }

        function setStartSlide(index) {
            this.startSlide = (index < 0 || index > this.total) ? 0 : index;
        }

        function setCurrentIndex(index) {
            return this.currentIndex = index;
        }

        function getOuterWidth() {
            return parseInt(this.width + this.border);
        }

        function getOuterHeight() {
            return parseInt(this.height + this.border, 10);
        }

        function setLock(value) {
            return this.lock = value;
        }

        function getLock() {
            return this.lock;
        }

        function getSlides() {
            return this.slides;
        }

        function setSlides() {
            var num = Math.floor(this.visible / 2) + 1,
                dir = 'ltr';

            this.leftSlides = [];
            this.rightSlides = [];

            for (var m = 1; m < num; m++) {
                var eq1 = (this.dir === dir) ? (this.currentIndex + m) % (this.total) : (this.currentIndex - m) % (this.total),
                    eq2 = (this.dir === dir) ? (this.currentIndex - m) % (this.total) : (this.currentIndex + m) % (this.total);

                this.leftSlides.push(eq1);
                this.rightSlides.push(eq2);
            }

            var rightOut = this.leftOutSlide = (this.currentIndex - num),
                leftOut = this.rightOutSlide = ((this.total - this.currentIndex - num) <= 0) ? (-parseInt(this.total - this.currentIndex - num)) : (this.currentIndex + num);

            if (this.dir === dir) {
                this.leftOutSlide = rightOut;
                this.rightOutSlide = leftOut;
            }

            return this.slides;
        }

        function isLastSlide() {
            return this.currentIndex === this.total - 1;
        }

        function isFirstSlide() {
            return this.currentIndex === 0;
        }

        function getSourceProp() {
            return this.sourceProp;
        }

        angular.extend(Carousel3d.prototype, proto);

        return ( Carousel3d );
    }
})();