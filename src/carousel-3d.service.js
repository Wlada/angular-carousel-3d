/*!
 * angular-carousel-3d
 *
 * Version: 0.0.5
 * License: MIT
 */


(function () {
    'use strict';

    angular
        .module('angular-carousel-3d')
        .factory("Carousel3dService", Carousel3dService);

    // ==
    // == Directive Service
    // ========================================
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
            this.states = {
                PENDING: 1,
                LOADING: 2,
                RESOLVED: 3,
                REJECTED: 4
            };
            this.total = this.slides.length;
            this.currentIndex = 0;
            this.lock = false;
            this.sourceProp = params.sourceProp || 'src';
            this.visible = params.visible || 5;
            this.perspective = params.animationSpeed || 35;
            this.animationSpeed = params.animationSpeed || 500;
            this.dir = params.dir || 'ltr';
            this.width = params.width || 360;
            this.height = params.height || 270;
            this.border = 5;
            this.space = params.space || 'auto';
            this.topSpace = params.topSpace || 'auto';
            this.inverseScaling = params.inverseScaling || 300;
            this.state = this.states.PENDING;
            this.deferred = $q.defer();
            this.promise = this.deferred.promise;
        }

        // == Public Service methods
        // ========================================

        Carousel3d.build = function (model, params) {
            var carousel = new Carousel3d(model, params || {});

            return carousel.load();
        };

        // == Private Service methods
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
            setSlides : setSlides,
            setCurrentIndex: setCurrentIndex,
            setVisibleNumber: setVisibleNumber,
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

            for (var i = 0; i < this.total; i++) {
                this.loadImageLocation(this.slides[i]);
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
            //this.visible = (this.visible > this.total) ? this.total : this.visible;
            //
            //if (this.visible !== 2) {
            //    this.visible = (this.visible % 2) ? this.visible : this.visible - 1;
            //}
        }

        function setCurrentIndex(index) {
            return this.currentIndex = index;
        }

        function setVisibleNumber(number) {
            this.visible = (number > this.total) ? this.total : number;

            try {
                if (number === 2) {
                    this.visible = number;
                } else {
                    this.visible = (number % 2) ? number : number - 1;
                }
            } catch (error) {
                $log.error(error);
            }
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

        function getSlides(){
            return this.slides;
        }

        function setSlides(){
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

        function isLastSlide(){
            return this.currentIndex === this.total - 1;
        }

        function isFirstSlide(){
            return this.currentIndex === 0;
        }

        function getSourceProp(){
            return this.sourceProp;
        }

        angular.extend(Carousel3d.prototype, proto);

        return ( Carousel3d );
    }
})();