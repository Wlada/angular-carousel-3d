# Angular Carousel 3D

### This repository is no longer maintained.
### Feel free to create pull requests if you have some improvement, but I won't do any testing


Angular directive that allow you to build 3D carousel.

[Carousel DEMO PAGE](http://vladimirbujanovic.com/angular-carousel-3d/demo/demo.html)

## Setup and usage :

 1. If you use bower, just run `bower install angular-carousel-3d`. If not, download files `angular-swipe.js`, `carousel-3d.css`, and `carouse3d.js` from the following github repos :

    - [Angular Swipe](https://github.com/adzialocha/angular-swipe/tree/master/dist)
    - [Angular Carousel 3D](https://github.com/Wlada/angular-carousel-3d/tree/master/dist)

*Note: you can download and use the minified versions as well.*

  2. Add theses files to your code:
```html
<link href="carousel-3d.css" rel="stylesheet" type="text/css" />
<script src="angular.js"></script>
<script src="angular-swipe.js"></script>
<script src="carousel-3d.js"></script>
```

 3. Add the `angular-carousel-3d` module as a dependency to your application module:
```js
angular.module('MyApp', ['angular-carousel-3d']);
```

 4. In your template :
 - Add a `carousel-3d` attribute to any element.
 - Add `ng-model` with your array of objects
 - Add `carousel3d-slide` directive and `ng-repeat` to render slides
```html
<div carousel3d ng-model="arrayOfObjects">
    <div carousel3d-slide ng-repeat="slide in app.slides track by $index">
        <figure>
            <img ng-src="{{slide.src}}" alt=""/>
            <figcaption ng-bind="slide.caption"></figcaption>
        </figure>
    </div>
</div>
```
*Note: the directive works with or without `jQuery.`*

## Directive attributes :
- `ngModel`: an array containing the list of carousel slides
- `options`: an object containing theses properties:
  - `loop`: slide looping *(Default: `false`)*
  - `clicking`: enable navigation with slide clicking *(Default: `false`)*
  - `sourceProp` image source property *(Default: `''`)*
  - `visible` number of visible slides *(Default: `5`)*
  - `perspective` slide distance between z=0 *(Default: `35`)*
  - `animationSpeed` slide animation speed in ms *(Default: `500`)*
  - `dir` direction of the automatic slide *(Default: `ltr`, Available options : `'rlt'`, `'ltr'`)*
  - `width`: width of slide *(Default: `360`)*
  - `height`: height of slide *(Default: `270`)*
  - `border`: width of slide border *(Default: `0`)*
  - `space`: space between slides *(Default: `auto`)*
  - `topSpace`: space XXXX *(Default: `auto`)*
  - `controls`: toggle arrow controls on carousel *(Default: `false`)*
  - `startSlide`: scale of background slides *(Default: `0`)*
  - `inverseScaling`: scale of background slides *(Default: `300`)*
  - `autoRotationSpeed`: scale of background slides *(Default: `0`)*

## Directive callbacks :
- `on-selected-click` : Callback that is invoked when the center slide was clicked.
- `on-slide-change` : Callback that is invoked when the slide is changed.
- `on-last-slide` : Callback that is invoked on last slide selected.
- `on-before-change` : Callback that is invoked before slide change. Prevent the carousel from sliding by returning the boolean value `false` inside the callback.

## ToDo:
- Vertical Carousel option
- Add tests
