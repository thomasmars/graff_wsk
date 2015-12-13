/**
 * Created by thoma_000 on 19.09.2015.
 */
define(['jquery'], function ($) {

  var ProductsPage = function (beerData) {
    var self = this;

    this.currentIndex = 0;
    this.$mixItUp = $('.products-display');
    this.$productsList = $('.products-list');
    this.totalProductPages = $('.products-pages').length;
    this.$innerImageRoll = this.$productsList.find('.products-image-roll-inner');
    this.$imageRollArrowLeft = this.$productsList.find('.products-image-roll-arrow.left');
    this.$imageRollArrowRight = this.$productsList.find('.products-image-roll-arrow.right');
    this.currentImageRollIndex = 0;
    this.clonesLoaded = false;

    this.initFilterButtons();

    this.initImageButtons();
    this.initProductsButtons();

    this.beerClasses = this.getBeerClasses(beerData);

    self.setMinHeightInnerRoll = function () {
      var $innerRoll = $('.products-image-roll-inner');
      var minSize = $innerRoll.children('.mix').height();

      // Set height of inner container
      $innerRoll.css('min-height', minSize + 'px');
    };

    setTimeout(function () {
      self.initImageRollButtons();

      // Reinit image roll buttons when done mixing
      self.$mixItUp.on('mixEnd', function () {
        self.initImageRollButtons();

        // Unset height of inner container
        $('.products-image-roll-inner').css('height', '');
        self.resizeProductRoll();
      });

      self.$mixItUp.on('mixLoad', function () {
        self.setMinHeightInnerRoll();
      });

      self.$mixItUp.on('mixStart', function () {
        self.setMinHeightInnerRoll();
      });

    }, 100);


    $('body').on('reset-image-roll', function () {
      // Reset image roll
      self.currentImageRollIndex = 0;
      self.setImageRollTranslate();

      // Handle visibility of buttons
      self.fadeToToggle(self.$imageRollArrowLeft, (self.currentImageRollIndex === 0));
      self.fadeToToggle(self.$imageRollArrowRight, (self.currentImageRollIndex + self.getImageAmounts() >= self.rollElements));
    });

    $('body').on('changed-slide', function () {
      self.removeFooterColor();
    });

    $('.products').on('touchstart', function () {
      console.log("started touching");
    });
  };

  ProductsPage.prototype.orientationResize = function () {
    var self = this;
    var ratio = $(window).width() / $(window).height();
    var $productsDisplay = $('.products-display');
    var $body = $('body');

    // Landscape
    if (ratio > 1) {
      $body.removeClass('portrait');
      self.resizeWrapper($productsDisplay);
      self.isPortrait = false;
    } else { // Portrait
      self.isPortrait = true;
      $body.addClass('portrait');
      $body.trigger('reset-image-roll');
      self.portraitResize($productsDisplay);
    }

    self.resizeProductRoll();
  };

  ProductsPage.prototype.portraitResize = function ($productsDisplay) {
    var $productsDisplay = $productsDisplay || $('.products-display');

    $productsDisplay.removeClass('two-images four-images five-images').addClass('three-images');
    this.imageAmounts = 3;
  };

  ProductsPage.prototype.resizeWrapper = function ($productsDisplay) {
    var self = this;
    var windowWidth = $(window).width();

    var $productsDisplay = $productsDisplay || $('.products-display');

    if (windowWidth <= 600) {
      $productsDisplay.removeClass('three-images four-images five-images').addClass('two-images');
      self.imageAmounts = 2;
    } else if (windowWidth <= 900) {
      $productsDisplay.removeClass('two-images four-images five-images').addClass('three-images');
      self.imageAmounts = 3;
    } else if (windowWidth <= 1200) {
      $productsDisplay.removeClass('two-images three-images five-images').addClass('four-images');
      self.imageAmounts = 4;
    } else {
      $productsDisplay.removeClass('two-images three-images four-images').addClass('five-images');
      self.imageAmounts = 5;
    }
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

  ProductsPage.prototype.resizeProductRoll = function () {
    var $productsDisplay = $('.products-display');
    var $productsList = $('.products-list');
    var $images = $productsDisplay.find('.mix');
    var decrementPercentage = 0.5;

    // Reset products display
    $productsDisplay.removeClass('full-height');

    // Reset image height
    $images.css('width', '');

    // Reduce image size if products display is too big.
    console.log("is portrait ?", this.isPortrait);
    console.log("prod displ outer height", $productsDisplay.outerHeight());
    console.log("prod list h", $productsList.height());

    if (this.isPortrait && ($productsDisplay.outerHeight() > $productsList.height())) {
      // Disable skewered centering since product list is taking up full height
      $productsDisplay.addClass('full-height');


      var reduceImageSize = function ($images, currWidth) {
        console.log("reduce image size ?");
        var newWidth = currWidth - decrementPercentage;
        console.log("new width", newWidth);
        $images.css('width', newWidth + '%');
      };

      var imagesTooBig = true;
      var test = 0;
      while(imagesTooBig && test < 100) {
        $productsDisplay.addClass('disable-transitions');
        var currWidth = $images.width() / $productsList.width() * 100;
        test += 1;
        reduceImageSize($images, currWidth);
        if ($productsDisplay.outerHeight() < $productsList.height()) {
          imagesTooBig = false;
        }
      }
      $productsDisplay.removeClass('disable-transitions');
    }

    this.setMinHeightInnerRoll()
  };

  ProductsPage.prototype.loadClones = function () {
    var self = this;

    // Clone pages and attach them to the left side
    var $productPages = $('.products-pages');
    var clonesLoaded = 0;
    var totalClones = $productPages.length;
    $productPages.each(function () {
      var left = ((self.totalProductPages + 1 - (parseInt($(this).css('left'))) / $productPages.width())) * -100;
      var $clone = $(this).clone()
        .css('left', left + '%')
        .addClass('clone')
        .appendTo(self.$productsList);

      self.initGoHomeButtons($clone.find('.back-to-product'));

      $clone.ready(function () {
        clonesLoaded += 1;

        if (clonesLoaded >= totalClones) {
          self.clonesLoaded = true;
        }
      });
    });
  };

  ProductsPage.prototype.initProductsButtons = function () {
    this.initGoHomeButtons($('.back-to-product'));
  };

  ProductsPage.prototype.initImageRollButtons = function () {
    var self = this;
    var $mixElements = this.$productsList.find('.mix');
    var scrollAmount = $mixElements.get(0).offsetWidth;
    var visibleElements = this.getImageAmounts();
    var rollElements = 0;
    $mixElements.each(function () {
      if ($(this).is(':visible')) {
        rollElements += 1;
      }
    });

    this.$imageRollArrowLeft.unbind('click')
      .click(function () {

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
        scrollAmount = $mixElements.get(0).offsetWidth;

        console.log("scroll amount ?", scrollAmount);
        self.setImageRollTranslate(-1 * self.currentImageRollIndex * scrollAmount);
      });

    this.$imageRollArrowRight.unbind('click')
      .click(function () {

        // All images already shown
        if (self.currentImageRollIndex + 1 + visibleElements > rollElements) {
          return;
        }

        // Decrease current image roll index
        self.currentImageRollIndex += 1;

        if (self.currentImageRollIndex + visibleElements >= rollElements) {
          self.fadeToHidden(self.$imageRollArrowRight);
        }
        self.fadeToShown(self.$imageRollArrowLeft);

        // Negative translation
        scrollAmount = $mixElements.get(0).offsetWidth;
        console.log("scroll amount ?", scrollAmount);

        self.setImageRollTranslate(-1 * self.currentImageRollIndex * scrollAmount);
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
    var self = this;
    value = value ? value : 0;
    console.log("translating ", value);
    if (!self.isPortrait) {
      this.$innerImageRoll.css({
        '-webkit-transform': 'translateX(' + value + 'px)',
        transform: 'translateX(' + value + 'px)'
      })
    }
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

  ProductsPage.prototype.initFilterButtons = function () {
    var self = this;

    $('.filter-series button')
      .on('touchstart', function () {
        $(this).addClass('no-hover');
      }).click(function () {

      // Remove all active classes for buttons
      $('.filter-series button').each(function () {
        $(this).removeClass('active');
      });

      // Add active state to this button
      $(this).addClass('active');
      $(this).removeClass('no-hover');
    });
  };

  ProductsPage.prototype.initImageButtons = function () {
    var self = this;
    $('.products-display .mix').each(function () {
      $(this).click(function () {
        var beerIndex = $(this).attr('data-my-order');
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

    // Get beer class
    if (index !== 0) {
      var beerClass = $('.products-display .mix').eq(index - 1).attr('class').split(' ').pop().split('-').pop();
      $('body').addClass(beerClass);
    } else {
      this.removeFooterColor();
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

  ProductsPage.prototype.transitionProductList = function (value) {
    this.$productsList.css({
      '-webkit-transition': value,
      transition: value
    });
  };

  ProductsPage.prototype.translateProductList = function (percentageTranslate) {
    this.$productsList.css({
      '-webkit-transform': 'translateX(' + percentageTranslate + '%)',
      transform: 'translateX(' + percentageTranslate + '%)'
    });
  };


  return ProductsPage;

});
