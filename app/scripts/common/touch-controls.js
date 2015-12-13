/**
 * Created by thoma_000 on 15.11.2015.
 */
define(['jquery'], function ($) {
  /**
   * @param {jquery} $wrapper Wrapper
   * @param {SlideControls} slideControls Slide controls object
   * @param [touchMoveDelay] Wait an amount of miliseconds before moving with touch listener in case of touch click
   * @param [touchMovePercentageThreshold] The percentage of a page that must be moved before a page will change
   * @constructor
   */
  var TouchControls = function ($wrapper, slideControls, touchMoveDelay, touchMovePercentageThreshold) {
    this.$wrapper = $wrapper;
    this.slideControls = slideControls;
    touchMoveDelay = touchMoveDelay || 100;
    touchMovePercentageThreshold = touchMovePercentageThreshold || 20;
    this.initTouchListeners(touchMoveDelay, touchMovePercentageThreshold);
  };

  TouchControls.prototype.initTouchListeners = function (touchMoveDelay, touchMovePercentageThreshold) {
    var self = this;
    this.touchStartY = 0;
    this.currentTranslateY = 0;
    this.touchDiffPercentage = 0;
    this.touchStartTime = 0;
    this.startedMoving = false;

    // Touch start
    $(window).on('touchstart', function (e) {
      self.touchStartTime = new Date().getTime();

      self.currentTranslateY = 0;
      if (self.$wrapper.hasClass('show-products')) {
        self.currentTranslateY = -100;
      } else if (self.$wrapper.hasClass('show-contact')) {
        self.currentTranslateY = -200;
      }
      self.touchStartY = e.originalEvent.touches[0].pageY;
    }).on('touchmove', function (e) {
      if (!self.startedMoving) {
        var timeElapsed = (new Date().getTime()) - self.touchStartTime;
        if (timeElapsed > touchMoveDelay) {
          self.startedMoving = true;
        } else {
          return;
        }
      }
      self.$wrapper.addClass('touch-moving');
      console.log("moving, current translateY", self.currentTranslateY);

      var touchCurrentY = e.originalEvent.touches[0].pageY;
      var touchDiff = touchCurrentY - self.touchStartY;
      self.touchDiffPercentage = (touchDiff / self.$wrapper.height()) * 100;
      if (self.touchDiffPercentage > 100) {
        self.touchDiffPercentage = 100;
      } else if (self.touchDiffPercentage < -100) {
        self.touchDiffPercentage = -100;
      }
      var newTouchPercentage = self.currentTranslateY + self.touchDiffPercentage;
      console.log("newtouch percentage", newTouchPercentage);
      var maxTouchPercentage = (self.$wrapper.children().length - 1) * -100;
      console.log("max touch percentage", maxTouchPercentage);

      // Do not allow scrolling out of content
      if (newTouchPercentage > 0) {
        newTouchPercentage = 0;
      }
      else if (newTouchPercentage < maxTouchPercentage) {
        newTouchPercentage = maxTouchPercentage;
      }
      console.log("new touch percentage", newTouchPercentage);

      self.$wrapper.css({
        '-webkit-transform': 'translateY(' + newTouchPercentage + '%)',
        transform: 'translateY(' + newTouchPercentage + '%)'
      });

    }).on('touchend', function (e) {
      if (!self.startedMoving) {
        return
      }

      self.$wrapper.removeClass('touch-moving').css({
        '-webkit-transform': '',
        transform: ''
      });
      if (self.touchDiffPercentage > touchMovePercentageThreshold) {
        self.slideControls.slideUp();
      } else if (self.touchDiffPercentage < -touchMovePercentageThreshold) {
        self.slideControls.slideDown();
      }

      // Get ready for next touch event
      self.startedMoving = false;
    });
  };

  return TouchControls;
});
