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
  var TouchControls = require('./touch-controls');

  // Mustache templates
  var productsMain = require('../templates/products-main.mustache');
  var imageRoll = require('../templates/image-roll.mustache');
  var productPages = require('../templates/product-pages.mustache');

  console.log("TEST!");

  var adjustFontSize = function () {
    console.log("window resize", $(window).width());
    console.log("new font size");
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

      console.log("reset font size");
      // Reset font size
      $('body').css('font-size', '');
    }
  };

  $(document).ready(function(){
    var $wrapper = $('.wrapper');

    // Load images and clones
    console.log("ResourceLoader", ResourceLoader);
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
          console.log(resourceLoader);
          resourceLoader.initMixItUp();


          // Enable product page functionality
          var slideControls = new SlideControls($wrapper);
          new TouchControls($wrapper, slideControls);
          var productsPage = new ProductsPage(view);
          new GraffHeader($wrapper, productsPage);
          new ContactPage();

          // Resize products page
          productsPage.orientationResize();

          // Finally load clones to create 'product roll'
          productsPage.loadClones();

          // Set font size
          console.log("what is width ?");
          console.log($(window).width());
          console.log(screen.width);

          $(window).resize(function () {
            adjustFontSize();
            productsPage.orientationResize();
          });
          adjustFontSize();
          productsPage.orientationResize();
        });
    });
  });

  $('.footer').on('touchstart', function (event) {
    console.log("footer touched");
    event.preventDefault();
  });


})();
