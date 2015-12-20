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
var GraffHeader = function ($wrapper, productsPage) {
  this.$wrapper = $wrapper;
  this.productsPage = productsPage;
  this.initClickListeners();
};

GraffHeader.prototype.initClickListeners = function () {
  var self = this;

  $('.button-home, .img-logo').click(function () {
    self.productsPage.removeFooterColor();
  });

  $('.button-products').click(function () {
    self.productsPage.removeFooterColor();
    self.productsPage.goHome();
  });

  $('.button-contact').click(function () {
    self.productsPage.removeFooterColor();
  });
};

module.exports = GraffHeader;
