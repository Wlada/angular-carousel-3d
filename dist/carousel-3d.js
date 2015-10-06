/*!
 * angular-carousel-3d
 * 
 * Version: 0.0.5 - 2015-10-06T21:00:31.924Z
 * License: MIT
 */


/*!
 * angular-carousel-3d
 * 
 * Version: 0.0.5
 * License: MIT
 */


(function () {
    'use strict';

    angular
        .module('angular-carousel-3d', [
            'swipe'
        ])
        .factory("PreloaderService", PreloaderService)
        .directive('carousel3d', carousel3d)
        .controller('Carousel3dController', Carousel3dController);

    // ==
    // == Directive Controller
    // ========================================
    Carousel3dController.$inject = ['$scope', '$element', '$attrs', '$timeout', '$log', 'PreloaderService'];

    function Carousel3dController($scope, $element, $attrs, $timeout, $log, PreloaderService) {
        var vm = this;

        vm.isLoading = true;
        vm.isSuccessful = false;
        vm.isRendered = false;
        vm.percentLoaded = 0;
        vm.options = {
            sourceProp: 'src',
            visible: 3,
            perspective: 35,
            animationSpeed: 500,
            startSlide: 0,
            dir: 'ltr',
            width: 480,
            height: 360,
            border: 10,
            space: 'auto',
            topSpace: 'auto'
        };

        // == Bind functions to controller
        vm.init = init;
        vm.slideClicked = slideClicked;
        vm.goPrev = goPrev;
        vm.goNext = goNext;

        // == Carousel wrapper element
        var $wrapper = null;

        // == Extend default carousel options with directive options attribute
        angular.extend(vm.options, vm.carousel3dOptions);

        // == Set initial directive height
        $element.css({
            'height': vm.options.height + vm.options.border + 'px'
        });

        // == Watch changes on model and options object
        $scope.$watch('[vm.ngModel, vm.carousel3dOptions]', function () {

            PreloaderService
                .preloadImages(vm.ngModel, vm.options.sourceProp)
                .then(
                // == Preloaded images success resolve handler
                function handleResolve(imageLocations) {
                    vm.isLoading = false;
                    vm.isSuccessful = true;

                    $timeout(function () {
                        init();
                    });
                },
                // == Preloaded images reject  handler
                function handleReject(imageLocation) {
                    vm.isLoading = false;
                    vm.isSuccessful = false;
                },
                // == Preloaded images notify handler which is executed multiple times during preload
                function handleNotify(event) {
                    vm.percentLoaded = event.percent;
                }
            );

        }, true);

        function init() {

            // == Clear properties
            vm.slides = [];
            vm.rightItems = [];
            vm.leftItems = [];
            vm.rightOutItem = null;
            vm.leftOutItem = null;
            vm.total = 0;
            vm.centerSlide = null;
            vm.currentIndex = null;
            vm.lock = false;

            // == Extend default carousel options with directive options attribute
            angular.extend(vm.options, vm.carousel3dOptions);

            // == Cache carousel wrapper element
            $wrapper = angular.element($element[0].querySelector('.carousel-3d'));

            // == Cache Carousel slides
            var $slides = $wrapper.children();

            if (!$slides.length > 0) {
                return false
            }

            // == Set carousel wrapper view port in the center of the carousel
            $wrapper.css({
                'width': vm.options.width + vm.options.border + 'px',
                'height': vm.options.height + vm.options.border + 'px'
            });

            //== Update slides with attributes  
            for (var i = 0; i < $slides.length; i++) {

                var slide = $slides[i],
                    $slide = angular.element(slide),
                    attributes = {
                        'outerwidth': vm.options.width + vm.options.border,
                        'outerheight': vm.options.height + vm.options.border,
                        'width': vm.options.width,
                        'height': vm.options.height,
                        'index': i
                    },
                    cssStyles = {
                        visibility: 'hidden',
                        'border-width': vm.options.border + 'px'
                    };

                $slide.attr(attributes);
                $slide.css(cssStyles);

                vm.slides.push($slide);
            }

            vm.total = vm.slides.length;

            //== Set startSlide
            vm.options.startSlide = (vm.options.startSlide < 0 || vm.options.startSlide > vm.total) ? 0 : vm.options.startSlide;
            vm.currentIndex = vm.options.startSlide;

            //== Set initial currentSlide
            vm.selectedSlide = vm.slides[vm.currentIndex];

            //== Fix slides number
            vm.options.visible = (vm.options.visible > vm.total) ? vm.total : vm.options.visible;

            if (vm.options.visible === 2) {
                vm.options.visible = (vm.options.visible % 2) ? vm.options.visible : vm.options.visible;
            } else {
                vm.options.visible = (vm.options.visible % 2) ? vm.options.visible : vm.options.visible - 1;
            }

            render();
        }

        function render(animate, speedTime) {

            var num = Math.floor(vm.options.visible / 2) + 1;

            vm.leftItems = [];
            vm.rightItems = [];

            for (var m = 1; m < num; m++) {
                var eq1 = (vm.options.dir == "ltr") ? (vm.currentIndex + m) % (vm.total) : (vm.currentIndex - m) % (vm.total);
                vm.leftItems.push(getSlide(eq1));


                var eq2 = (vm.options.dir == "ltr") ? (vm.currentIndex - m) % (vm.total) : (vm.currentIndex + m) % (vm.total);
                vm.rightItems.push(getSlide(eq2));
            }

            vm.leftOutItem = getSlide(vm.currentIndex - num);
            vm.rightOutItem = ((vm.total - vm.currentIndex - num) <= 0) ?
                              getSlide(-parseInt(vm.total - vm.currentIndex - num)) :
                              getSlide(vm.currentIndex + num);

            var leftOut = vm.leftOutItem,
                rightOut = vm.rightOutItem;

            if (vm.options.dir == "ltr") {
                vm.leftOutItem = rightOut;
                vm.rightOutItem = leftOut;
            }

            //Set initial slides styles
            var slideTop = (vm.options.topSpace == "auto") ? ((vm.options.height / 2) - (parseInt(vm.selectedSlide.attr('outerheight')) / 2)) : 0,
                slideLeft = ((vm.options.width / 2) - (parseInt(vm.selectedSlide.attr('outerwidth')) / 2)),
                center = (vm.options.width / 4),
                zIndex = 999,
                css = {},
                speed = (speedTime) ? (speedTime / 1000) : (vm.options.animationSpeed / 1000),
                slide;

            if (animate) {
                for (var l = 0; l < vm.slides.length; l++) {
                    vm.slides[l].css({
                        '-webkit-transition': "all " + speed + "s ",
                        '-moz-transition': "all " + speed + "s ",
                        '-o-transition': "all " + speed + "s ",
                        '-ms-transition': "all " + speed + "s ",
                        'transition': "all " + speed + "s "
                    });
                }
            }


            for (var k = 0; k < vm.slides.length; k++) {
                vm.slides[k].css({
                    position: 'absolute',
                    opacity: 0,
                    visibility: 'hidden',
                    overflow: 'hidden',
                    top: slideTop + 'px'
                });
            }

            vm.selectedSlide
                .addClass('current')
                .css({
                    zIndex: zIndex,
                    opacity: 1,
                    visibility: 'visible'
                });

            vm.selectedSlide
                .css({
                    '-webkit-transform': 'none',
                    '-moz-transform': 'none',
                    '-o-transform': 'none',
                    '-ms-transform': 'none',
                    'transform': 'none',
                    left: slideLeft + 'px',
                    top: slideTop + 'px',
                    width: vm.selectedSlide.attr('width') + "px",
                    height: vm.selectedSlide.attr('height') + "px"
                });

            for (var i = 0; i < vm.rightItems.length; i++) {
                slide = vm.rightItems[i];

                zIndex -= i + 1;
                css = setCss(slide, i, zIndex, true);

                slide
                    .css(css)
                    .css({
                        opacity: 1,
                        visibility: 'visible',
                        zIndex: zIndex
                    });
            }

            for (var j = 0; j < vm.leftItems.length; j++) {
                slide = vm.leftItems[j];

                zIndex -= j + 1;
                css = setCss(slide, j, zIndex);

                slide
                    .css(css)
                    .css({
                        opacity: 1,
                        visibility: 'visible',
                        zIndex: zIndex
                    });
            }

            if (vm.total > vm.options.visible) {

                var rCSS = setCss(vm.rightOutItem, vm.leftItems.length - 0.5, vm.leftItems.length - 1, true),
                    lCSS = setCss(vm.leftOutItem, vm.leftItems.length - 0.5, vm.leftItems.length - 1);

                vm.rightOutItem.css(rCSS);
                vm.leftOutItem.css(lCSS);
            }

            vm.isRendered = true;
        }

        function setCss(slide, i, zIndex, positive) {

            var leftRemain = (vm.options.space == "auto") ?
                             parseInt((i + 1) * (parseInt(angular.element(slide).attr('width')) / 1.5)) :
                             parseInt((i + 1) * (vm.options.space)),

                transform = (positive) ?
                            'translateX(' + (leftRemain) + 'px) translateZ(-' + (250 + ((i + 1) * 110)) + 'px) rotateY(-' + vm.options.perspective + 'deg)' :
                            'translateX(-' + (leftRemain) + 'px) translateZ(-' + (250 + ((i + 1) * 110)) + 'px) rotateY(' + vm.options.perspective + 'deg)',
                left = "0%",
                top = (vm.options.topSpace == "auto") ? "none" : parseInt((i + 1) * (vm.options.space)),
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


            if (vm.onBeforeChange) {
                vm.onBeforeChange({
                    index: vm.currentIndex
                });
            }

            vm.currentIndex = (index < 0 || index > vm.total - 1) ? 0 : index;

            if (vm.currentIndex == vm.total - 1) {
                if (vm.onLastSlide) {
                    vm.onLastSlide({
                        index: vm.currentIndex
                    });
                }
            }

            vm.selectedSlide = vm.slides[vm.currentIndex];

            for (var i = 0; i < vm.slides.length; i++) {
                vm.slides[i].removeClass('current');
            }

            vm.lock = true;

            render(true, vm.options.animationSpeed);

            $timeout(function () {
                animationEnd();
            }, vm.options.animationSpeed);

            if (farchange) {
                return false;
            }

            return true;
        }

        function goNext(farchange) {

            farchange = (farchange) ? farchange : false;

            if (!farchange && vm.lock) {
                return false;
            }

            if (vm.currentIndex == vm.total) {
                goSlide(0, false, farchange);

            } else {
                goSlide(vm.currentIndex + 1, false, farchange);
            }

            return false;
        }

        function goPrev(farchange) {

            farchange = (farchange) ? farchange : false;

            if (!farchange && vm.lock) {
                return false;
            }

            if (vm.currentIndex == 0) {
                goSlide(vm.total - 1, false, farchange);

            } else {
                goSlide(vm.currentIndex - 1, false, farchange);
            }

            return false;
        }

        function goFar(index) {
            var diff = (index == vm.total - 1 && vm.currentIndex == 0) ? -1 : (index - vm.currentIndex);

            if (vm.currentIndex == vm.total - 1 && index == 0) {
                diff = 1;
            }

            var diff2 = (diff < 0) ? -diff : diff,
                timeBuff = 0;

            for (var i = 0; i < diff2; i++) {
                var timeout = (diff2 == 1) ? 0 : (timeBuff);

                $timeout(function () {
                    (diff < 0) ? goPrev(diff2) : goNext(diff2);
                }, timeout);

                timeBuff += (vm.options.animationSpeed / (diff2));
            }
        }

        function animationEnd() {
            vm.lock = false;

            if (vm.onSlideChange) {
                vm.onSlideChange({
                    index: vm.currentIndex
                });
            }
        }

        function getSlide(index) {
            return (index >= 0) ? vm.slides[index] : vm.slides[vm.slides.length + index];
        }

        function slideClicked(index) {

            if (vm.currentIndex != index) {
                goFar(index);

            } else {
                if (vm.onSelectedClick) {
                    vm.onSelectedClick({
                        index: vm.currentIndex
                    });
                }
            }
        }
    }

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
            '           <img ng-repeat=\"image in vm.ngModel track by $index\" ng-src=\"{{image[vm.options.sourceProp]}}\" class=\"slide-3d\" ng-click=\"vm.slideClicked($index)\" ng-swipe-left=\"vm.goPrev()\" ng-swipe-right=\"vm.goNext()\">' +
            '       </div>' +
            '       <p ng-switch-when=\"false\" class="carousel-3d-loader-error">There was a problem during load</p>' +
            '   </div>' +
            '</div>',
            replace: true,
            scope: {
                ngModel: '=',
                carousel3dOptions: '=',
                onSelectedClick: '&',
                onSlideChange: '&',
                onLastSlide: '&',
                onBeforeChange: '&'
            },
            controller: 'Carousel3dController as vm',
            bindToController: true,
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

    // Preloading Images In AngularJS With Promises
    // http://www.bennadel.com/blog/2597-preloading-images-in-angularjs-with-promises.htm
    //
    // == Preloader Factory
    // ========================================
    PreloaderService.$inject = ['$q', '$rootScope'];

    function PreloaderService($q, $rootScope) {

        function Preloader(imageLocations, imageProp) {
            this.imageLocations = imageLocations;
            this.imageProp = imageProp;
            this.imageCount = this.imageLocations.length;
            this.loadCount = 0;
            this.errorCount = 0;
            this.states = {
                PENDING: 1,
                LOADING: 2,
                RESOLVED: 3,
                REJECTED: 4
            };
            this.state = this.states.PENDING;
            this.deferred = $q.defer();
            this.promise = this.deferred.promise;
        }

        Preloader.preloadImages = function (imageLocations, imageProp) {
            var preloader = new Preloader(imageLocations, imageProp);

            return ( preloader.load() );
        };

        var proto = {
            constructor: Preloader,
            isInitiated: isInitiated,
            isRejected: isRejected,
            isResolved: isResolved,
            load: load,
            handleImageError: handleImageError,
            handleImageLoad: handleImageLoad,
            loadImageLocation: loadImageLocation
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
                return ( this.promise );
            }

            this.state = this.states.LOADING;

            for (var i = 0; i < this.imageCount; i++) {
                this.loadImageLocation(this.imageLocations[i][this.imageProp]);
            }

            return ( this.promise );
        }

        function handleImageError(imageLocation) {
            this.errorCount++;

            if (this.isRejected()) {
                return;
            }

            this.state = this.states.REJECTED;
            this.deferred.reject(imageLocation);
        }

        function handleImageLoad(imageLocation) {
            this.loadCount++;

            if (this.isRejected()) {
                return;
            }

            this.deferred.notify({
                percent: Math.ceil(this.loadCount / this.imageCount * 100),
                imageLocation: imageLocation
            });

            if (this.loadCount === this.imageCount) {
                this.state = this.states.RESOLVED;
                this.deferred.resolve(this.imageLocations);
            }
        }

        function loadImageLocation(imageLocation) {

            var preloader = this,
                image = new Image();

            image.onload = function (event) {
                $rootScope.$apply(function () {
                        preloader.handleImageLoad(event.target.src);
                        preloader = image = event = null;
                    }
                );

            };
            image.onerror = function (event) {
                $rootScope.$apply(function () {
                        preloader.handleImageError(event.target.src);
                        preloader = image = event = null;
                    }
                );
            };
            image.src = imageLocation;
        }

        angular.extend(Preloader.prototype, proto);

        return ( Preloader );
    }
})();