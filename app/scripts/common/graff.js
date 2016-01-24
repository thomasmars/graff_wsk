/**
 * Created by Thomas Marstrander on 20.08.2015.
 */
var Graff = function () {
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

  $(document).ready(function(){
    var $wrapper = $('.wrapper');
    var resourceLoader;

    // Load Mustache content
    $.getJSON('data/products.json', function (view) {

      // Render product page template
      $(productsMain.render(view, {
        'image-roll': imageRoll,
        'product-pages': productPages
      })).appendTo($('.products'))
        .promise()
        .then(function () {

          // Init
          resourceLoader = new ResourceLoader();
          resourceLoader.resizeBackgroundImages();
          var productsPage = new ProductsPage(view);
          var slideControls = new SlideControls($wrapper);
          new GraffHeader($wrapper, productsPage, slideControls);
          new ContactPage();

          // Resize products page
          $(window).resize(function () {
            resourceLoader.resizeBackgroundImages();
            productsPage.detectOrientation();
            productsPage.resizeWrapper();
            slideControls.scrollToClosestTarget(100);
          });
          $(window).resize();

          // Finally load clones and lightbox to product pages
          productsPage.loadClones()
            .initLightBox();
        });
    });
  });

  $('.footer').on('touchstart', function (event) {
    event.preventDefault();
  });

};

module.exports = Graff;
