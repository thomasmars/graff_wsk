/**
 * Created by thoma_000 on 17.11.2015.
 */
define(['jquery', 'mix-it-up'], function ($) {


  var ResourceLoader = function () {
    var self = this;

    self.initMixItUp = function () {
      $('.products-display').mixItUp({
        animation: {
          effects: 'fade'
        }
      });
    };

    $(window).on('touchmove', function (e) {
      e.preventDefault();
    });

    var imageResize = function ($img) {

      var natWidth = $img.get(0).naturalWidth;
      var natHeight = $img.get(0).naturalHeight;
      var imgRatio = natWidth / natHeight;

      var width = $(window).width();
      var height = $(window).height();
      var windowRatio = width / height;

      if (imgRatio > windowRatio) {
        // Must scale image to wrapper height
        $img.css({
          'height': height,
          'width': 'auto',
          'top': ''
        });
      } else {
        // Height too big, must center image
        var newHeight = width / imgRatio;

        // Remove top height
/*        var top = newHeight - height;
        if ($img.hasClass('img-contact')) {
          // Add 10 %
          top -= (newHeight / 9);
        }*/

        $img.css({
          'width': width,
          'height': 'auto'
/*          'top': -top*/
        })
      }
    };

    var initMainImagesLoad = function () {
      var $mainImages = $('.img-home, .img-contact');

      var resizeImages = function () {
        $mainImages.each(function () {
          imageResize($(this));
        });
      };

      resizeImages();
      $(window).resize(function () {
        resizeImages();
      });
    };

    self.init = function () {
      initMainImagesLoad();
      return self;
    }
  };

  return ResourceLoader;
});
