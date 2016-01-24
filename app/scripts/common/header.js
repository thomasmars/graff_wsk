/**
 * Created by thoma_000 on 19.09.2015.
 */

var $ = require('jquery');

/**
 *
 * @param $wrapper
 * @param {ProductsPage} productsPage
 * @constructor
 */
var GraffHeader = function ($wrapper, productsPage, slideControls) {
  this.$wrapper = $wrapper;
  this.productsPage = productsPage;
  this.slideControls = slideControls;
  this.initClickListeners();
};

GraffHeader.prototype.initClickListeners = function () {
  var self = this;

  $('.button-home, .img-logo').click(function () {
    self.productsPage.removeFooterColor();
    self.slideControls.jumpTo(1);
  });

  $('.button-products').click(function () {
    self.productsPage.removeFooterColor();
    self.productsPage.goHome();
    self.slideControls.jumpTo(2);
  });

  $('.button-contact').click(function () {
    self.productsPage.removeFooterColor();
    self.slideControls.jumpTo(3);
  });

  $('.nav-home').click(function () {
    self.productsPage.removeFooterColor();
    self.slideControls.jumpTo(1);
  });

  $('.nav-products').click(function () {
    self.productsPage.removeFooterColor();
    self.productsPage.goHome();
    self.slideControls.jumpTo(2);
  });

  $('.nav-contact').click(function () {
    self.productsPage.removeFooterColor();
    self.slideControls.jumpTo(3);
  });

  $('')
};

module.exports = GraffHeader;
