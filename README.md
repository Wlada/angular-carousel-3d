# Angular Image Carousel 3D
Angular Image 3D Carousel

This is BETA version. Plugin is under development. 

[DEMO](http://vladimirbujanovic.com/angular-carousel-3d/demo/demo.html)

## Usage :

 - If you use bower, just `bower install angular-carousel-3d`. If not, download files from the github repo.
 - Add `angular-swipe.js`, `angular-carousel-3d.css`, and `angular-carouse3d.js` to your code:
```html
<link href="angular-carousel-3d.css" rel="stylesheet" type="text/css" />
<script src="angular.js"></script>
<script src="angular-swipe.js"></script>
<script src="angular-carousel-3d.js"></script>
```

 - Add the `angular-carousel-3d` module as a dependency to your application module:
```js
angular.module('MyApp', ['angular-carousel-3d']);
```

 - Add a `carousel-3d` attribute to any element.
```html
<div carousel3d></div>
```
 - ng-model is required, so that the directive knows which model to update.
```html
<div carousel3d ng-model="yourImageArray"></div>
```

## Directive options :
#`carousel3d-options` options object properties
 - `visible` number of visible slides
 - 'sourceProp' : image source url property
 - `perspective` slide distance between z=0
 - `animationSpeed` slide animation speed in ms
 - `startSlide` : index of start slide
 - `width`: width of slide
 - `height`: height of slide
 - `border`: width of slide border
 - `space`: space between slides
