(function () {
    angular
        .module('demo', [
            'ngSanitize',
            'angular-carousel-3d'
        ])
        .controller('AppController', AppController);

    AppController.$inject = ['$scope', '$log'];

    function AppController($scope, $log) {
        var vm = this;

        // SLIDES WITH CAPTIONS
        //===================================
        vm.slides = [
            {'src': 'images/photo2.jpg', caption: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim, maxime.'},
            {'src': 'images/photo3.jpg', caption: 'Lorem ipsum dolor sit amet '},
            {'src': 'images/photo4.jpg', caption: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. '},
            {'src': 'images/photo5.jpg', caption: 'Lorem ipsum dolor sit amet,  Enim, maxime.'},
            {'src': 'images/photo6.jpg', caption: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim, maxime.'}
        ];

        vm.options = {
            clicking: true,
            sourceProp: 'src',
            visible: 5,
            perspective: 35,
            startSlide: 0,
            border: 3,
            dir: 'ltr',
            width: 360,
            height: 270,
            space: 220,
            autoRotationSpeed: 2500,
            loop: true
        };


        // ANY HTML
        //===================================
        vm.slides2 = [
            {'bg': '#2a6496', caption: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim, maxime.'},
            {'bg': '#000000', caption: 'Lorem ipsum dolor sit amet '},
            {'bg': '#ffcc41', caption: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. '},
            {'bg': '#445fac', caption: 'Lorem ipsum dolor sit amet,  Enim, maxime.'},
            {'bg': '#442BF3', caption: 'Lorem ipsum dolor sit amet,  Maxime.'}
        ];

        vm.options2 = {
            visible: 3,
            perspective: 35,
            startSlide: 0,
            border: 0,
            dir: 'ltr',
            width: 360,
            height: 270,
            space: 220,
            loop: false,
            controls: true
        };

        vm.removeSlide = removeSlide;
        vm.addSlide = addSlide;
        vm.selectedClick = selectedClick;
        vm.slideChanged = slideChanged;
        vm.beforeChange = beforeChange;
        vm.lastSlide = lastSlide;
        vm.preventBeforeChange = false;

        function lastSlide(index) {
            $log.log('Last Slide Selected callback triggered. \n == Slide index is: ' + index + ' ==');
        }

        function beforeChange(index) {
          $log.log('Before Slide Change callback triggered. \n == Slide index is: ' + index + ' ==');

          if (vm.preventBeforeChange) {
            $log.log('Slide change prevented by beforeChange callback. \n');
            return false;
          }
        }

        function selectedClick(index) {
            $log.log('Selected Slide Clicked callback triggered. \n == Slide index is: ' + index + ' ==');
        }

        function slideChanged(index) {
            $log.log('Slide Changed callback triggered. \n == Slide index is: ' + index + ' ==');
        }


        function addSlide(slide, array) {
            array.push(slide);
            vm.slide2 = {};
        }

        function removeSlide(index, array) {
            array.splice(array.indexOf(array[index]), 1);
        }
    }


})();
