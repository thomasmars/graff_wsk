/**
 * Created by Thomas Marstrander on 20.08.2015.
 */
(function () {
  var self = this;
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
          self.resourceLoader = new ResourceLoader();
          self.resourceLoader.resizeBackgroundImages();
          var productsPage = new ProductsPage(view);
          new SlideControls($wrapper);
          new GraffHeader($wrapper, productsPage);
          new ContactPage();

          // Resize products page
          productsPage.orientationResize();

          // Finally load clones to create 'product roll'
          productsPage.loadClones();
        });
    });
  });

  $(window).resize(function () {
    if (self.resourceLoader) {
      self.resourceLoader.resizeBackgroundImages();
    }
  })

  $('.footer').on('touchstart', function (event) {
    event.preventDefault();
  });

})();
