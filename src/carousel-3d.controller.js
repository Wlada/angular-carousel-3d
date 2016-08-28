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
                    if (!vm.autoRotationLocked){
                        if(vm.dir === 'rtl') {
                            vm.goPrev();
                        } else {
                            vm.goNext();
                        }
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