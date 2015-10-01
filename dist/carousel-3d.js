/*!
 * angular-directive-boilerplate
 * 
 * Version: 0.0.8 - 2015-10-01T19:25:38.022Z
 * License: MIT
 */


(function () {
    'use strict';

    angular
        .module('angular-carousel-3d', [
            'swipe'
        ])
        .directive('carousel3d', carousel3d)
        .controller('Carousel3dController', Carousel3dController);

    // ==
    // == Directive Controller
    // ========================================
    Carousel3dController.$inject = ['$scope', '$element', '$attrs', '$timeout', '$log'];

    function Carousel3dController($scope, $element, $attrs, $timeout, $log) {
        var vm = this;

        // == Bind function to controller
        vm.init = init;
        vm.slideClicked = slideClicked;
        vm.goPrev = goPrev;
        vm.goNext = goNext;

        //== Carousel properties
        var props = null,
            $wrapper = $element.children();

        //TODO: Debug problem with $watchGroup and change $watch to $watchGroup

        $scope.$watch('vm.ngModel', function (data) {

            $timeout(function () {
                init();
            });
        }, true);

        $scope.$watch('vm.carousel3dOptions', function (data) {

            $timeout(function () {
                init();
            });
        }, true);

        function init() {

            // == Directive defaults and properties
            props = {
                slides: [],
                rightItems: [],
                leftItems: [],
                rightOutItem: null,
                leftOutItem: null,
                visible: 3,
                perspective: 35,
                animationSpeed: 500,
                startSlide: 0,
                dir: 'ltr',
                total: 0,
                slide: 0,
                current: null,
                width: 480,
                height: 360,
                border: 10,
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

            //Set initial currentSlide


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
                //props.onLastSlide.call(this);
            }

            //props.onBeforeChange.call(this);

            props.slide = (index < 0 || index > props.total - 1) ? 0 : index;

            if (props.slide == props.total - 1) {
                //props.onSlideShowEnd.call(this);
            }

            props.currentSlide = props.slides[props.slide];

            for (var i = 0; i < props.slides.length; i++) {
                props.slides[i].removeClass('current');
            }

            props.lock = true;

            layout(true, props.animationSpeed);

            if (fastchange) {
                return false;
            }

            $timeout(function () {
                animationEnd();
            }, props.animationSpeed);

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

            $timeout(function () {
                animationEnd();
            }, props.animationSpeed);
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

        }

        function getSlide(index) {
                return (index >= 0) ? props.slides[index] : props.slides[props.slides.length + index];
        }
    }

    carousel3d.$inject = ['$timeout'];

    function carousel3d($timeout) {

        var carousel3d = {
            restrict: 'AE',
            template: '<div class=\"carousel-3d-container\"><div class=\"carousel-3d\"><img ng-repeat=\"image in vm.ngModel track by $index\" ng-src=\"{{image[vm.carousel3dSourceProp]}}\" class=\"slide-3d\" ng-click=\"vm.slideClicked($index)\" ng-swipe-left=\"vm.goPrev()\" ng-swipe-right=\"vm.goNext()\"></div></div>',
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