/**
 * Created by thoma_000 on 17.11.2015.
 */
var $ = require('jquery');

/**
 * Init mix it up library
 */
var initMixItUp = function () {
  var loaded = 0;
  var $mixItUpImages = $('.mix > img');
  var imagesToLoad = $mixItUpImages.length;

  // Wait for images to load
  $mixItUpImages.one('load', function () {
    // Image loaded
    loaded += 1;

    // Check if all images are loaded
    if (loaded >= imagesToLoad) {

      // Apply mixItUp to container
      $('.products-display').mixItUp({
        animation: {
          effects: 'fade'
        }
      });
    }
  }).each(function () {

    // Make sure loaded is run for cached images.
    if (this.complete) {
      $(this).load();
    }
  })

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
  };
};

module.exports = ResourceLoader;
