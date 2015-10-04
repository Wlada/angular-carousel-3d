/*!
 * angular-carousel-3d
 * 
 * Version: 0.0.4
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
    // == Preloader Factory
    // ========================================
    PreloaderService.$inject = ['$q', '$rootScope'];

    function PreloaderService($q, $rootScope) {

        function Preloader(imageLocations, imageProp) {
            this.imageLocations = imageLocations;
            this.imageProp = imageProp ;
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

    // ==
    // == Directive Carousel 3d Controller
    // ========================================
    Carousel3dController.$inject = ['$scope', '$element', '$attrs', '$timeout', '$log', 'PreloaderService'];

    function Carousel3dController($scope, $element, $attrs, $timeout, $log, PreloaderService) {
        var vm = this;

        vm.isLoading = true;
        vm.isSuccessful = false;
        vm.redered = false;
        vm.percentLoaded = 0;

        // == Bind function to controller
        vm.init = init;
        vm.slideClicked = slideClicked;
        vm.goPrev = goPrev;
        vm.goNext = goNext;

        //== Carousel properties
        var props = null,
            $wrapper = null;

        //TODO: Debug problem with $watchGroup and change $watch to $watchGroup

        $scope.$watch('[vm.ngModel, vm.carousel3dOptions]', function () {
            PreloaderService
                .preloadImages(vm.ngModel, vm.carousel3dSourceProp)
                .then(
                function handleResolve(imageLocations) {
                    vm.isLoading = false;
                    vm.isSuccessful = true;
                    //console.info("Preload Successful");
                    $timeout(function () {
                        init();
                    });
                },
                function handleReject(imageLocation) {
                    vm.isLoading = false;
                    vm.isSuccessful = false;
                    //console.error("Image Failed", imageLocation);
                    //console.info("Preload Failure");
                },
                function handleNotify(event) {
                    vm.percentLoaded = event.percent;
                    //console.info("Percent loaded:", event.percent);
                }
            );
        }, true);

        function init() {

            $wrapper = angular.element($element[0].querySelector('.carousel-3d'));

            // == Directive defaults and properties
            props = {
                slides: [],
                rightItems: [],
                leftItems: [],
                rightOutItem: null,
                leftOutItem: null,
                visible:  3,
                perspective:  35,
                animationSpeed:  500,
                startSlide:  0,
                dir: 'ltr',
                total: 0,
                slide: 0,
                current: null,
                width:  480,
                height:  360,
                border:  10,
                space: 'auto',
                topSpace: 'auto',
                lock: false
            };

            var $slides = $wrapper.children();

            if (!$slides.length > 0) {
                return false
            }

            angular.extend(props, vm.carousel3dOptions);

            $wrapper.css({
                'width': props.width + props.border + 'px',
                'height': props.height + props.border + 'px'
            });

            //== Find slides
            for (var i = 0; i < $slides.length; i++) {

                var slide = $slides[i],
                    $slide = angular.element(slide),
                    attributes = {
                        'outerwidth': props.width + props.border,
                        'outerheight': props.height + props.border,
                        'width': props.width,
                        'height': props.height,
                        'index': i
                    },
                    cssStyles = {
                        visibility: 'hidden',
                        'border-width': props.border + 'px'
                    };

                $slide.attr(attributes);

                $slide.css(cssStyles);

                props.slides.push($slide);
            }

            props.total = props.slides.length;

            //== Set startSlide
            props.startSlide = (props.startSlide < 0 || props.startSlide > props.total) ? 0 : props.startSlide;
            props.slide = props.startSlide;

            //== Set initial currentSlide
            props.currentSlide = props.slides[props.slide];

            //== Fix slides number
            props.visible = (props.visible > props.total) ? props.total : props.visible;

            if (props.visible === 2) {
                props.visible = (props.visible % 2) ? props.visible : props.visible;
            } else {
                props.visible = (props.visible % 2) ? props.visible : props.visible - 1;
            }

            layout();
        }

        function slideClicked(index) {

            if (props.slide != index) {
                goFar(index);

            } else {
                if (vm.onSelectedClick) {
                    vm.onSelectedClick({
                        index: props.slide
                    });
                }
            }
        }

        function goSlide(index, motionless, fastchange) {


            if (props.slide == props.total - 1) {
                //TODO:  last slide callback
            }

            //TODO: before chance slide

            props.slide = (index < 0 || index > props.total - 1) ? 0 : index;

            if (props.slide == props.total - 1) {
                //TODO:  end  callback
            }

            props.currentSlide = props.slides[props.slide];

            for (var i = 0; i < props.slides.length; i++) {
                props.slides[i].removeClass('current');
            }

            props.lock = true;

            layout(true, props.animationSpeed);

            $timeout(function () {
                animationEnd();
            }, props.animationSpeed);

            if (fastchange) {
                return false;
            }

            return true;
        }

        function goNext(fastchange) {

            fastchange = (fastchange) ? fastchange : false;

            if (!fastchange && props.lock) {
                return false;
            }

            if (props.slide == props.total) {
                goSlide(0, false, fastchange);

            } else {
                goSlide(props.slide + 1, false, fastchange);
            }

            return false;
        }

        function goPrev(fastchange) {

            fastchange = (fastchange) ? fastchange : false;

            if (!fastchange && props.lock) {
                return false;
            }

            if (props.slide == 0) {
                goSlide(props.total - 1, false, fastchange);

            } else {
                goSlide(props.slide - 1, false, fastchange);
            }

            return false;
        }

        function goFar(index) {
            var diff = (index == props.total - 1 && props.slide == 0) ? -1 : (index - props.slide);

            if (props.slide == props.total - 1 && index == 0) {
                diff = 1;
            }

            var diff2 = (diff < 0) ? -diff : diff,
                timeBuff = 0;

            for (var i = 0; i < diff2; i++) {
                var timeout = (diff2 == 1) ? 0 : (timeBuff);

                $timeout(function () {
                    (diff < 0) ? goPrev(diff2) : goNext(diff2);
                }, timeout);

                timeBuff += (props.animationSpeed / (diff2));
            }
        }

        function animationEnd() {
            props.lock = false;

            if (vm.onSlideChange) {
                vm.onSlideChange({
                    index: props.slide
                });
            }
        }

        function setCss(slide, i, zIndex, positive) {

            var leftRemain = (props.space == "auto") ?
                             parseInt((i + 1) * (parseInt(angular.element(slide).attr('width')) / 1.5)) :
                             parseInt((i + 1) * (props.space)),

                transform = (positive) ?
                            'translateX(' + (leftRemain) + 'px) translateZ(-' + (250 + ((i + 1) * 110)) + 'px) rotateY(-' + props.perspective + 'deg)' :
                            'translateX(-' + (leftRemain) + 'px) translateZ(-' + (250 + ((i + 1) * 110)) + 'px) rotateY(' + props.perspective + 'deg)',
                left = "0%",
                top = (props.topSpace == "auto") ? "none" : parseInt((i + 1) * (props.space)),
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

        function layout(animate, speedTime) {

            var num = Math.floor(props.visible / 2) + 1;

            props.leftItems = [];
            props.rightItems = [];

            for (var m = 1; m < num; m++) {
                var eq1 = (props.dir == "ltr") ? (props.slide + m) % (props.total) : (props.slide - m) % (props.total);
                props.leftItems.push(getSlide(eq1));


                var eq2 = (props.dir == "ltr") ? (props.slide - m) % (props.total) : (props.slide + m) % (props.total);
                props.rightItems.push(getSlide(eq2));
            }

            props.leftOutItem = getSlide(props.slide - num);
            props.rightOutItem = ((props.total - props.slide - num) <= 0) ?
                                 getSlide(-parseInt(props.total - props.slide - num)) :
                                 getSlide(props.slide + num);

            var leftOut = props.leftOutItem,
                rightOut = props.rightOutItem;

            if (props.dir == "ltr") {
                props.leftOutItem = rightOut;
                props.rightOutItem = leftOut;
            }

            //Set initial slides styles
            var slideTop = (props.topSpace == "auto") ? ((props.height / 2) - (parseInt(props.currentSlide.attr('outerheight')) / 2)) : 0,
                slideLeft = ((props.width / 2) - (parseInt(props.currentSlide.attr('outerwidth')) / 2)),
                center = (props.width / 4),
                zIndex = 999,
                css = {},
                speed = (speedTime) ? (speedTime / 1000) : (props.animationSpeed / 1000),
                slide;

            if (animate) {
                for (var l = 0; l < props.slides.length; l++) {
                    props.slides[l].css({
                        '-webkit-transition': "all " + speed + "s ",
                        '-moz-transition': "all " + speed + "s ",
                        '-o-transition': "all " + speed + "s ",
                        '-ms-transition': "all " + speed + "s ",
                        'transition': "all " + speed + "s "
                    });
                }
            }


            for (var k = 0; k < props.slides.length; k++) {
                props.slides[k].css({
                    position: 'absolute',
                    opacity: 0,
                    visibility: 'hidden',
                    overflow: 'hidden',
                    top: slideTop + 'px'
                });
            }

            props.currentSlide
                .addClass('current')
                .css({
                    zIndex: zIndex,
                    opacity: 1,
                    visibility: 'visible'
                });

            props.currentSlide.css({
                '-webkit-transform': 'none',
                '-moz-transform': 'none',
                '-o-transform': 'none',
                '-ms-transform': 'none',
                'transform': 'none',
                left: slideLeft + 'px',
                top: slideTop + 'px',
                width: props.currentSlide.attr('width') + "px",
                height: props.currentSlide.attr('height') + "px"
            });

            for (var i = 0; i < props.rightItems.length; i++) {
                slide = props.rightItems[i];

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

            for (var j = 0; j < props.leftItems.length; j++) {
                slide = props.leftItems[j];

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

            if (props.total > props.visible) {

                var rCSS = setCss(props.rightOutItem, props.leftItems.length - 0.5, props.leftItems.length - 1, true),
                    lCSS = setCss(props.leftOutItem, props.leftItems.length - 0.5, props.leftItems.length - 1);

                props.rightOutItem.css(rCSS);
                props.leftOutItem.css(lCSS);
            }

            vm.redered = true;
        }

        function getSlide(index) {
            return (index >= 0) ? props.slides[index] : props.slides[props.slides.length + index];
        }
    }

    // ==
    // == Directive Carousel 3d
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
            '       <div class=\"carousel-3d\" ng-switch-when=\"true\" ng-show="vm.redered">' +
            '           <img ng-repeat=\"image in vm.ngModel track by $index\" ng-src=\"{{image[vm.carousel3dSourceProp]}}\" class=\"slide-3d\" ng-click=\"vm.slideClicked($index)\" ng-swipe-left=\"vm.goPrev()\" ng-swipe-right=\"vm.goNext()\">' +
            '       </div>' +
            '       <p ng-switch-when=\"false\">There was a problem during load</p>' +
            '   </div>' +
            '</div>',
            replace: true,
            scope: {
                ngModel: '=',
                carousel3dSourceProp: '@',
                carousel3dOptions: '=',
                onSelectedClick: '&',
                onSlideChange: '&'
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

})();