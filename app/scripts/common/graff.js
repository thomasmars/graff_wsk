'use strict';

/**
 * Created by Thomas Marstrander on 20.08.2015.
 */
class Graff  {
  constructor() {
    var $ = require('jquery');
    require('fullpage.js', jQuery);
    var ResourceLoader = require('./resource-loader');
    var ProductsPage = require('../pages/products-page');
    var ContactPage = require('../pages/contact-page');

    // Mustache templates
    var productsMain = require('../templates/products-main.mustache');
    var imageRoll = require('../templates/image-roll.mustache');
    var productPages = require('../templates/product-pages.mustache');

    $(document).ready(function(){
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

            $('.wrapper').fullpage({
              sectionSelector: '.main-page',
              onLeave: function () {
                $('body').trigger('changedSlide');
              }
            });

            // Init
            resourceLoader = new ResourceLoader();
            resourceLoader.resizeBackgroundImages();
            var productsPage = new ProductsPage(view);
            new ContactPage();

            // Resize products page
            $(window).resize(function () {
              resourceLoader.resizeBackgroundImages();
              productsPage.detectOrientation();
              productsPage.resizeWrapper();
            });
            $(window).resize();

            // Finally load clones and lightbox to product pages
            productsPage.loadClones()
              .initLightBox()
              .initProductsButtons();
          });
      });
    });

    $('.footer').on('touchstart', function (event) {
      event.preventDefault();
    });
  }
}

module.exports = Graff;
