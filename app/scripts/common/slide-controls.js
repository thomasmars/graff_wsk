/**
 * Created by thoma_000 on 19.09.2015.
 */
var $ = require('jquery');
var SlideControls = function ($wrapper) {
  this.$wrapper = $wrapper;
  this.initScrollToElementAnchors();
  this.addScrollToClosestElementListener();
};

/**
 * Adds a listener that scrolls to the closest page element after a scroll has been performed
 */
SlideControls.prototype.addScrollToClosestElementListener = function () {
  var self = this;
  this.$wrapper.scroll(function (e) {

    // Auto scrolling is performed
    clearTimeout(self.scrollTimer);
    if (self.autoScrolling) {
      e.preventDefault();
      return false;
    }
    self.scrollTimer = setTimeout(function () {
      self.scrollToClosestTarget();
    }, 500);
  });
};

/**
 * Add scroll listener to slide to closest slide.
 */
SlideControls.prototype.scrollToClosestTarget = function () {
  var $targets = this.$wrapper.children();
  var $closest = this.findClosestScrollTarget($targets, this.$wrapper);
  this.scrollToElement($closest);
};

/**
 * Find closest scroll target from current scroll
 * @param {jQuery} [$targets]
 * @param {jQuery} [$wrapper]
 * @returns {jQuery} $closest
 */
SlideControls.prototype.findClosestScrollTarget = function ($targets, $wrapper) {
  $targets = $targets || this.$wrapper.children();
  $wrapper = $wrapper || this.$wrapper;
  var $closest = $targets.get(0);
  var closestDiff;

  $targets.each(function () {
    var targetDiff = Math.abs($(this).offset().top - $wrapper.offset().top);

    // Set current diff
    if (closestDiff === undefined) {
      $closest = $(this);
      closestDiff = targetDiff;
    }
    else if (targetDiff < closestDiff) {
      $closest = $(this);
      closestDiff = targetDiff;
    }
  });

  return $closest;
};

/**
 * Slide down to the next page
 * @param {boolean} [slideUp] Slide up instead of down
 */
SlideControls.prototype.slide = function (slideUp) {
  var $currentPage = this.$wrapper.children().is('.active');
  var $nextPage = $currentPage.next();
  if (slideUp) {
    $nextPage = $currentPage.prev();
  }
  if ($nextPage) {
    this.scrollToElement($nextPage);
  }
  $('body').trigger('changedSlide');
};

/**
 * Scroll to element
 * @param {jQuery} $element
 * @param {boolean} [instantScroll] Scroll instantly, no delays
 */
SlideControls.prototype.scrollToElement = function ($element, instantScroll) {
  var self = this;
  this.$wrapper.children().removeClass('active');
  var currentScroll = this.$wrapper.scrollTop();
  var scrollTo = $element.offset().top - this.$wrapper.offset().top + currentScroll;
  this.autoScrolling = true;
  this.$wrapper.stop()
    .animate({
      scrollTop: scrollTo
    }, {
      duration: instantScroll ? 0 : 500,
      complete: function () {
        setTimeout(function () {
          if (!self.currentScrollElement || self.currentScrollElement.get(0) !== $element.get(0)) {
            $('body').trigger('changedSlide');
            self.currentScrollElement = $element;
          }
          self.autoScrolling = false;
        }, 100);
      }
    });
  $element.addClass('active');
};

SlideControls.prototype.initScrollToElementAnchors = function () {
  var self = this;
  $('a').click(function () {
    var href = $.attr(this, 'href');
    var $target = $( $.attr(this, 'href') );
    self.scrollToElement($target);
    return false;
  })
};

module.exports = SlideControls;
