/**
 * Created by Thomas Marstrander on 20.08.2015.
 */
(function () {
  var $ = require('jquery');
  var SlideControls = require('./slide-controls');
  var GraffHeader = require('./header');
  var ResourceLoader = require('./resource-loader');
  var ProductsPage = require('../pages/products-page');
  var ContactPage = require('../pages/contact-page');

  // Mustache templates
  var productsMain = require('../templates/products-main.mustache');
  var imageRoll = require('../templates/image-roll.mustache');
  var productPages = require('../templates/product-pages.mustache');

  /**
   * @deprecated
   */
  var adjustFontSize = function () {
    var step = 50;
    var threshold = 600;
    var standardFont = 16;
    var remainder = threshold - $(window).width();
    if (remainder >= 0) {
      var fontReduction = Math.ceil(remainder / step);
      var newFont = standardFont - fontReduction;
      console.log("new font size", newFont);
      $('body').css('font-size', newFont + 'px');
    }
    else {

      // Reset font size
      $('body').css('font-size', '');
    }
  };

  var animateToElement = function ($element) {
    var $scrollable = $('main');
    console.log("element offset", $element.offset().top);
    console.log("main offset", $scrollable.offset().top);
    console.log("current scroll", $scrollable.scrollTop());
    var currentScroll = $scrollable.scrollTop();
    var scrollTo = $element.offset().top - $scrollable.offset().top + currentScroll;
    var scrollTimer = scrollTo - currentScroll;
    $scrollable
      .stop()
      .animate({
        scrollTop: scrollTo
      }, Math.abs(scrollTimer / 2));
  };

  $(document).ready(function(){
    var $wrapper = $('.wrapper');

    // Load images and clones
    var resourceLoader = new ResourceLoader();

    // Load Mustache content
    $.getJSON('data/products.json', function (view) {

      // Render product page template
      $(productsMain.render(view, {
        'image-roll': imageRoll,
        'product-pages': productPages
      }))
        .appendTo($('.products'))
        .promise()
        .then(function () {

          // Init mix it up
          resourceLoader.initMixItUp();


          // Enable product page functionality
          var productsPage = new ProductsPage(view);
          new SlideControls($wrapper);
          new GraffHeader($wrapper, productsPage);
          new ContactPage();

          // Resize products page
          productsPage.orientationResize();

          // Finally load clones to create 'product roll'
          productsPage.loadClones();

          $('a').click(function () {
            var href = $.attr(this, 'href');
            var $target = $( $.attr(this, 'href') );
            animateToElement($target);
            return false;
          })
        });
    });
  });

  $('.footer').on('touchstart', function (event) {
    console.log("footer touched");
    event.preventDefault();
  });

})();
