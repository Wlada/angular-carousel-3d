'use strict';

describe('carousel3d', function () {
  var scope, $compile, $rootScope, element;

  function createDirective(template) {
    var elm;

    elm = angular.element(template);
    angular.element(document.body).prepend(elm);
    $compile(elm)(scope);
    scope.$digest();

    return elm;
  }

  beforeEach(module('ngSanitize', 'carousel3d'));

  beforeEach(inject(function(_$rootScope_, _$compile_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  afterEach(function () {
    if (element) element.remove();
  });

  describe('as an element', function(){ runTestsWithTemplate('<carousel3d></carousel3d>'); });
  describe('as an attribute', function(){ runTestsWithTemplate('<div carousel3d></div>'); });

  function runTestsWithTemplate(template) {
    describe('when created', function () {

      it('should initial the value to 0', function () {
        element = createDirective(template);

        expect(element.text()).toContain('0');
      });
    });
  }

});