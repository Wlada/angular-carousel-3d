# Angular Carousel 3D

Angular directive that allow you to build 3D image carousel.

[Carousel DEMO PAGE](http://vladimirbujanovic.com/angular-carousel-3d/demo/demo.html)

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
 - Add ng-model with your array of objects which contain image source url
```html
<div carousel3d ng-model="arrayOfObjects"></div>
```
 - `Directive works with or without jQuery.`

## Directive options :
`carousel3d-options` options object with properties:
  - `sourceProp` image source property
  - `visible` number of visible slides
  - `perspective` slide distance between z=0
  - `animationSpeed` slide animation speed in ms
  - `startSlide` : index of start slide
  - `width`: width of slide
  - `height`: height of slide
  - `border`: width of slide border
  - `space`: space between slides

## Directive callbacks :
`on-selected-click` : Callback that is invoked when the center slide was clicked.

`on-slide-change` : Callback that is invoked when the slide is changed.

`on-last-slide` : Callback that is invoked on last slide selected.

`on-before-change` : Callback that is invoked before slide change.


### To do:
- Vertical Carousel option
- Navigation option
- Arrows option
- Auto scroll option
