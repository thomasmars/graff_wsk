/**
 * Created by thoma_000 on 19.09.2015.
 */
var $ = require('jquery');
require('../imports/mini-lightbox');
var ProductsPage = function (beerData) {
  var self = this;

  this.currentIndex = 0;
  this.$mixItUp = $('.products-display');
  this.$productsList = $('.products-list');
  this.$productsPages = $('.products-pages');
  this.totalProductPages = $('.products-pages').length;
  this.$innerImageRoll = this.$productsList.find('.products-image-roll-inner');
  this.$imageRollArrowLeft = this.$productsList.find('.products-image-roll-arrow.left');
  this.$imageRollArrowRight = this.$productsList.find('.products-image-roll-arrow.right');
  this.currentImageRollIndex = 0;
  this.clonesLoaded = false;

  this.placeProductPages();
  this.initImageButtons();

  this.beerClasses = this.getBeerClasses(beerData);

  setTimeout(function () {
    self.initImageRollButtons();
    self.initImageRollTouch();
  }, 100);


  $('body').on('reset-image-roll', function () {
    // Reset image roll
    self.currentImageRollIndex = 0;
    self.setImageRollTranslate();

    // Handle visibility of buttons
    self.fadeToToggle(self.$imageRollArrowLeft, (self.currentImageRollIndex === 0));
    self.fadeToToggle(self.$imageRollArrowRight, (self.currentImageRollIndex + self.getImageAmounts() >= self.rollElements));

  }).on('changedSlide', function () {
    self.removeFooterColor();
    self.goHome();
  });

  // Resize product roll once all images has loaded
  var $rollImages = this.$mixItUp.find('img');
  var imagesToLoad = $rollImages.length;
  var imagesLoaded = 0;
  $rollImages.load(function () {
    imagesLoaded += 1;

    if (imagesLoaded >= imagesToLoad) {
      self.resizeWrapper();
    }
  }).each(function () {
    if (this.complete) {
      $(this).load();
    }
  })
};


ProductsPage.prototype.initLightBox = function () {
  var $lightboxButtons = this.$productsPages.find('.lightbox-button-image');
  window.MiniLightbox($lightboxButtons);

  return this;
};

ProductsPage.prototype.placeProductPages = function () {
  $('.products-pages').each(function (idx) {
    $(this).css('left', ((idx + 1) * 100) + '%');
  });
};

ProductsPage.prototype.detectOrientation = function () {
  var ratio = $(window).width() / $(window).height();

  this.portrait = ratio < 1;
  $('body').toggleClass('portrait', this.portrait);
};

ProductsPage.prototype.resizeWrapper = function ($productsDisplay) {
  var self = this;
  var windowWidth = $(window).width();

  $productsDisplay = $productsDisplay || $('.products-display');

  $productsDisplay.find('.mix').css('width', '');
  if (windowWidth <= 600) {
    self.imageAmounts = 2;
  } else if (windowWidth <= 900) {
    self.imageAmounts = 3;
  } else if (windowWidth <= 1200) {
    self.imageAmounts = 4;
  } else {
    self.imageAmounts = 5;
  }
  $productsDisplay.find('.mix').css('width', (100 / self.imageAmounts) + '%');


  this.reduceProductRollHeight();
  this.initImageRollButtons();
  // this.fitProductPagesFont();
};

ProductsPage.prototype.getBeerClasses = function (beerData) {
  var beerArray = [];

  beerData.products.forEach(function (beerCategory) {
    beerCategory['beer-products'].forEach(function (beer) {
      var beerClass = beer['beer-name'];
      beerArray.push(beerClass);
    })
  });

  return beerArray;
};

ProductsPage.prototype.reduceProductRollHeight = function () {
  var self = this;
  var $productsDisplay = $('.products-display');
  var $productsList = $('.products-list');
  var $images = $productsDisplay.find('.mix');

  if ($productsDisplay.outerHeight() > $productsList.height()) {

    var increaseImageAmounts = function () {
      self.imageAmounts += 1;
      $images.css('width', (100 / self.imageAmounts) + '%');
    };

    var imagesTooBig = true;
    var test = 0;
    while(imagesTooBig && test < 100 && self.imageAmounts < ProductsPage.maxImages) {
      $productsDisplay.addClass('disable-transitions');
      test += 1;
      increaseImageAmounts();
      if ($productsDisplay.outerHeight() < $productsList.height()) {
        imagesTooBig = false;
      }
    }
    $productsDisplay.removeClass('disable-transitions');
  }
};

ProductsPage.prototype.loadClones = function () {
  var self = this;

  // Clone pages and attach them to the left side
  var $productPages = $('.products-pages');
  var clonesLoaded = 0;
  var totalClones = $productPages.length;
  $productPages.each(function () {
    var left = (self.totalProductPages + 1 - $(this).index()) * -100;
    var $clone = $(this).clone()
      .css('left', left + '%')
      .addClass('clone')
      .appendTo(self.$productsList);

    self.initGoHomeButtons($clone.find('.back-to-product'));

    $clone.ready(function () {
      clonesLoaded += 1;

      if (clonesLoaded >= totalClones) {
        self.clonesLoaded = true;
        self.$productsPages = $('.products-pages');
      }
    });
  });

  return this;
};

ProductsPage.prototype.initProductsTouch = function () {
  var self = this;
  var moveThreshold = 100;
  var startPosX;
  var readyToMove;
  $('.products-pages').each(function (idx) {
    $(this).on('touchstart', function (e) {
      readyToMove = true;
      startPosX = e.originalEvent.touches[0].pageX;
    }).on('touchmove', function (e) {
      var moveDiff = e.originalEvent.touches[0].pageX - startPosX;
      if (!readyToMove || Math.abs(moveDiff) < moveThreshold) {
        return false;
      }

      if (moveDiff < moveThreshold) {
        self.productsMoveRight(idx);
      }
      else {
        self.productsMoveLeft(idx);
      }
      readyToMove = false;
    });
  });
};

ProductsPage.prototype.initProductsButtons = function () {
  this.initGoHomeButtons($('.back-to-product'));

  var self = this;
  $('.products-pages').each(function (idx) {
    $(this).children('.products-pages-inner-roll-arrow.left').click(function () {
      self.productsMoveLeft(idx);
    });

    $(this).children('.products-pages-inner-roll-arrow.right').click(function () {
      self.productsMoveRight(idx);
    });
  });

  this.initProductsTouch();
};

ProductsPage.prototype.productsMoveLeft = function (idx) {
  var rollElements = $('.products-display .mix').length;
  this.goToBeerPage(((((idx - 1) % rollElements) + rollElements) % rollElements) + 1);
};

ProductsPage.prototype.productsMoveRight = function (idx) {
  var rollElements = $('.products-display .mix').length;
  this.goToBeerPage(((idx + 1) % rollElements) + 1);
};

ProductsPage.prototype.initImageRollTouch = function () {
  var self = this;
  var moveThreshold = 100;
  var yMoveThreshold = 200;
  var startPosX;
  var startPosY;
  var readyToMove;
  this.$innerImageRoll.on('touchstart', function (e) {
    readyToMove = true;
    startPosX = e.originalEvent.touches[0].pageX;
    startPosY = e.originalEvent.touches[0].pageY;
  }).on('touchmove', function (e) {
    var moveDiffX = e.originalEvent.touches[0].pageX - startPosX;
    var moveDiffY = e.originalEvent.touches[0].pageY - startPosY;
    if (!readyToMove ||
      (Math.abs(moveDiffX) < moveThreshold && Math.abs(moveDiffY) < yMoveThreshold)) {
      return false;
    }

    if (moveDiffX < (-1 *moveThreshold)) {
      self.imageRollMoveRight();
    }
    else if (moveDiffX > moveThreshold) {
      self.imageRollMoveLeft();
    }
    else if (moveDiffY > yMoveThreshold) {
      $.fn.fullpage.moveSectionUp();
    }
    else {
      $.fn.fullpage.moveSectionDown();
    }

    readyToMove = false;
  });
};

ProductsPage.prototype.imageRollMoveLeft = function () {
  var self = this;
  var $mixElements = this.$productsList.find('.mix');


  // Already at min index
  if (self.currentImageRollIndex === 0) {
    return;
  }

  // Increase current image roll index
  self.currentImageRollIndex -= 1;

  if (self.currentImageRollIndex <= 0) {
    self.fadeToHidden(self.$imageRollArrowLeft)
  }
  self.fadeToShown(self.$imageRollArrowRight);

  // Negative translation
  self.setImageRollTranslate(-1 * self.currentImageRollIndex * $mixElements.get(0).offsetWidth);
};

ProductsPage.prototype.imageRollMoveRight = function () {
  var self = this;
  var visibleElements = this.getImageAmounts();
  var rollElements = 0;
  var $mixElements = this.$productsList.find('.mix');
  $mixElements.each(function () {
    if ($(this).is(':visible')) {
      rollElements += 1;
    }
  });

  // All images already shown
  if (self.currentImageRollIndex + 1 + visibleElements > rollElements) {
    return;
  }

  // Increase current image roll index
  self.currentImageRollIndex += 1;

  if (self.currentImageRollIndex + visibleElements >= rollElements) {
    self.fadeToHidden(self.$imageRollArrowRight);
  }
  self.fadeToShown(self.$imageRollArrowLeft);

  // Negative translation
  self.setImageRollTranslate(-1 * self.currentImageRollIndex * $mixElements.get(0).offsetWidth);
};

ProductsPage.prototype.initImageRollButtons = function () {
  var self = this;
  var $mixElements = this.$productsList.find('.mix');
  var visibleElements = this.getImageAmounts();
  var rollElements = 0;
  $mixElements.each(function () {
    if ($(this).is(':visible')) {
      rollElements += 1;
    }
  });

  this.$imageRollArrowLeft.unbind('click')
    .click(function () {
      self.imageRollMoveLeft()
    });

  this.$imageRollArrowRight.unbind('click')
    .click(function () {
      self.imageRollMoveRight();
    });

  // Reset image roll
  self.currentImageRollIndex = 0;
  self.setImageRollTranslate();

  // Handle visibility of buttons
  self.fadeToToggle(this.$imageRollArrowLeft, (this.currentImageRollIndex === 0));
  self.fadeToToggle(this.$imageRollArrowRight, (this.currentImageRollIndex + visibleElements >= rollElements));
  self.rollElements = rollElements;
};

ProductsPage.prototype.setImageRollTranslate = function (value) {
  value = value ? value : 0;
  this.$innerImageRoll.css({
    '-webkit-transform': 'translateX(' + value + 'px)',
    transform: 'translateX(' + value + 'px)'
  })
};

ProductsPage.prototype.getImageAmounts = function () {
  return this.imageAmounts;
};

ProductsPage.prototype.fadeToToggle = function ($element, boolean) {
  if (boolean) {
    this.fadeToHidden($element);
  } else {
    this.fadeToShown($element);
  }
};

ProductsPage.prototype.fadeToHidden = function ($element) {
  $element.addClass('hiding').on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (f) {
    $element.addClass('hidden');

    // Make sure event is only triggered once.
    $element.off(f);
  })
};

ProductsPage.prototype.fadeToShown = function ($element) {
  $element.removeClass('hidden').removeClass('hiding');
};

ProductsPage.prototype.initGoHomeButtons = function ($buttons) {
  var self = this;
  $buttons.click(function () {
    self.goHome();
  });
};

ProductsPage.prototype.initImageButtons = function () {
  var self = this;
  $('.products-display .mix').each(function () {
    $(this).click(function () {
      var beerIndex = $(this).index() + 1;
      self.$productsList.addClass('has-moved');
      if (beerIndex === 0) {
        self.$productsList.removeClass('has-moved');
      }

      self.goToBeerPage(beerIndex);
    });
  });
};

ProductsPage.prototype.goHome = function () {
  this.goToBeerPage(0);
};

ProductsPage.prototype.goToBeerPage = function (index) {
  if (index === this.currentIndex) {
    return;
  }

  this.removeFooterColor();
  var $mixElements = $('.products-display .mix');

  // Get beer class
  if (index !== 0) {
    var beerClass = $mixElements.eq(index - 1)
      .attr('class').split(' ').pop().split('-').pop();
    $('body').addClass(beerClass);
  }

  var self = this;
  var percentageTranslate = index * -100;

  if (self.clonesLoaded && (index > (this.totalProductPages / 2))) {

    // Move backwards
    var reverseIndex = (index - this.totalProductPages) - 1;
    percentageTranslate = reverseIndex * -100;

    self.translateProductList(percentageTranslate);
    this.currentIndex = index;
  } else {
    self.translateProductList(percentageTranslate);
    this.currentIndex = index;
  }
};

ProductsPage.prototype.removeFooterColor = function () {
  var $body = $('body');
  this.beerClasses.forEach(function (beerClass) {
    $body.removeClass(beerClass);
  });
};

ProductsPage.prototype.translateProductList = function (percentageTranslate) {
  this.$productsList.css({
    '-webkit-transform': 'translateX(' + percentageTranslate + '%)',
    transform: 'translateX(' + percentageTranslate + '%)'
  });
};

ProductsPage.minImages = 2;
ProductsPage.maxImages = 20;

ProductsPage.fontSizeDecrementStep = 0.5;

module.exports = ProductsPage;
