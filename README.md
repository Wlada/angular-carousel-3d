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
 - Add a dependency to the `angular-carousel-3d` module in your application.
```js
angular.module('MyApp', ['angular-carousel-3d']);
```

 - Add a `carousel-3d` attribute to any element.
```html
<div carousel3d></div>
```
