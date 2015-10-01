(function () {
    angular
        .module('demo', [
            'ngSanitize',
            'angular-carousel-3d'
        ])
        .controller('AppController', AppController);

    function AppController($scope) {
        var vm = this;

        vm.images = [
            {'src': 'images/photo1.jpg'},
            {'src': 'images/photo2.jpg'},
            {'src': 'images/photo3.jpg'},
            {'src': 'images/photo4.jpg'},
            {'src': 'images/photo5.jpg'},
            {'src': 'images/photo6.jpg'},
            {'src': 'images/photo7.jpg'},
            {'src': 'images/photo8.jpg'},
            {'src': 'images/photo9.jpg'}
        ];

        vm.options = {
            visible: 5,
            startSlide: 0,
            border: 3,
            width: 360,
            height: 270,
            space: 200,
            perspective: 35
        };

        vm.removeImage = removeImage;
        vm.addImage = addImage;
        vm.selectedClick = selectedClick;
        vm.slideChanged = slideChanged;

        function selectedClick(index) {

        }

        function slideChanged(index) {

        }

        function addImage(src) {
            vm.images.push({src: src});
        }

        function removeImage(index) {

            vm.images.splice(vm.images.indexOf(vm.images[index]), 1);
        }
    }


})();