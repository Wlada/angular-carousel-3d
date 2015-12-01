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
<div carousel3d ng-model="arrayOfObjectsWithImageSrc"></div>
```
 - `Directive works with or without jQuery.`

## Directive options :
`options` options object with properties:
  - `sourceProp` image source property (Default: 'src')
  - `visible` number of visible slides (Default: 5)
  - `perspective` slide distance between z=0 (Default: 35)
  - `animationSpeed` slide animation speed in ms (Default: 500)
  - `width`: width of slide (Default: 360)
  - `height`: height of slide (Default: 270)
  - `border`: width of slide border (Default: 5)
  - `space`: space between slides (Default: 'auto')
  - `inverseScaling`: Scale of background slides (Default: 250)

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
- Add tests
