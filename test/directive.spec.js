'use strict';

describe('carousel3d', function () {
  var $compile, $document, $rootScope;

  // Helpers

  function createDirective(template) {
    var element = angular.element(template);
    $document.prepend(element);
    var scope = $rootScope.$new();
    $compile(element)(scope);
    scope.$digest();
    return element;
  }

  // Tests

  beforeEach(function () {
    // Load the dependencies
    module('swipe');
    module('angular-carousel-3d');

    // Inject the services
    inject(function (_$rootScope_, _$compile_, _$document_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
      $document = _$document_;
    });
  });

  /**
   * Allow the tests to be run
   * using the directive
   * as an attribute or an element
   */
  function runTestsWithTemplate(template) {
    var element;

    beforeEach(function () {
      element = createDirective(template);
    });

    afterEach(function () {
      element.remove();
    });

    it('should display nothing with an empty template', function () {
      expect(element.text().trim()).toEqual('');
    });
  }

  describe('as an element', function () {
    runTestsWithTemplate('<carousel3d></carousel3d>');
  });

  describe('as an attribute', function () {
    runTestsWithTemplate('<div carousel3d></div>');
  });
});
