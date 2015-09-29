(function () {
    angular
        .module('demo', [
            'ngSanitize',
            'carousel3d'
        ])
        .controller('AppController', AppController);

    function AppController($scope){
        var vm = this;

        vm.images = [
            { 'src': 'images/photo1.jpg' },
            { 'src': 'images/photo2.jpg' },
            { 'src': 'images/photo3.jpg' },
            { 'src': 'images/photo4.jpg' },
            { 'src': 'images/photo5.jpg' },
            { 'src': 'images/photo6.jpg' },
            { 'src': 'images/photo7.jpg' },
            { 'src': 'images/photo8.jpg' },
            { 'src': 'images/photo9.jpg' }
        ];

        vm.options = {
            visible: 5,
            startSlide: 0
        };

        vm.removeImage = removeImage;
        vm.selectedClick = selectedClick;
        vm.slideChanged = slideChanged;

        function selectedClick(index){
            console.log(index);
        }

        function slideChanged(index){
            console.log(index);
        }

        function removeImage(index){
            console.log(vm.images.indexOf(vm.images[index]));
            vm.images.splice(vm.images.indexOf(vm.images[index]), 1);
        }
    }




})();