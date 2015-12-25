/**
 * Created by thoma_000 on 17.11.2015.
 */
var $ = require('jquery');

/**
 * Init mix it up library
 */
var initMixItUp = function () {
  $('.products-display').mixItUp({
    animation: {
      effects: 'fade'
    }
  });
};

var ResourceLoader = function () {
  var self = this;
  initMixItUp();

  self.resizeBackgroundImages = function () {
    var $backgroundImages = $('.img-backgrounds');

    $backgroundImages.each(function () {

      // Fit to height
      if ($(this).height() < $(this).parent().height()) {
        $(this).addClass('vertical-fit');
      } // Fit to width
      else if ($(this).width() < $(this).parent().width()) {
        $(this).removeClass('vertical-fit');
      }
    });
  }
};

module.exports = ResourceLoader;
