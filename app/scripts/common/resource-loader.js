/**
 * Created by thoma_000 on 17.11.2015.
 */
var $ = require('jquery');

var ResourceLoader = function () {
  var self = this;

  self.resizeBackgroundImages = function () {
    var $backgroundImages = $('.img-backgrounds');
    $backgroundImages.each(function () {

      // Figure out ratio of parent
      var parentRatio = $(this).parent().height() / $(this).parent().width();
      var imageRatio = $(this)[0].naturalHeight / $(this)[0].naturalWidth;

      if (parentRatio > imageRatio) {
        $(this).addClass('vertical-fit');
      }
      else {
        $(this).removeClass('vertical-fit');
      }
    });
  };
};

module.exports = ResourceLoader;
