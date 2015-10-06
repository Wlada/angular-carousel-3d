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

        vm.images = [
            {'src': 'images/photo2.jpg'},
            {'src': 'images/photo3.jpg'},
            {'src': 'images/photo4.jpg'},
            {'src': 'images/photo5.jpg'},
            {'src': 'images/photo6.jpg'},
            {'src': 'images/photo7.jpg'},
            {'src': 'images/photo8.jpg'}
        ];
        vm.options = {
            sourceProp: 'src',
            visible: 5,
            perspective: 35,
            startSlide: 0,
            border: 3,
            width: 360,
            height: 270,
            space: 200
        };

        vm.removeImage = removeImage;
        vm.addImage = addImage;
        vm.selectedClick = selectedClick;
        vm.slideChanged = slideChanged;
        vm.beforeChange = beforeChange;
        vm.lastSlide = lastSlide;


        function lastSlide(index) {
            $log.log('Last Slide Selected callback triggered. \n == Slide index is: ' + index + ' ==');
        }

        function beforeChange(index) {
            $log.log('Before Slide Change callback triggered. \n == Slide index is: ' + index + ' ==');
        }

        function selectedClick(index) {
            $log.log('Selected Slide Clicked callback triggered. \n == Slide index is: ' + index + ' ==');
        }

        function slideChanged(index) {
            $log.log('Slide Changed callback triggered. \n == Slide index is: ' + index + ' ==');
        }


        function addImage(src) {
            vm.images.push({
                src: src
            });
        }

        function removeImage(index) {
            vm.images.splice(vm.images.indexOf(vm.images[index]), 1);
        }
    }


})();