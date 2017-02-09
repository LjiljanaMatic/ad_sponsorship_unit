var path = require('path');
var wd = require('wd');
var Bfwd = require('../lib/bfwd');
var BfRunner = require('../lib/bf-runner');
var Post = require('../lib/post');
var browser = global.wd.browser;
var asserters = wd.asserters;
var today = new Date().toISOString().substring(0,10);

describe(path.basename(__filename), function() {
  describe("Custom Ad Sponsorship Unit on Bpage", function() {

    // SETUP
    beforeEach(function() {
      return BfRunner.loadFixture("sel2_internal_tools_ad_sponsorship_unit")
        .then(function () {
          return browser.setWindowSize(1200, 1100);
        });      
    });

    // TEAR DOWN
    afterEach(function() {
      return BfRunner.tearDown();
    });

	it("Runs Active Custom React with a Gif campaign With Right Gif order", function () {
      return browser.loadPage(global.wd.bf_url + '/geico/react-with-a-gif?test_date=' + today + ' 01:00:01')
        .then(function() {
          return Bfwd.verifyDocumentIsLoaded(global.wd.maxAssertionTimeout)
        })
        .then(function () {
          return Post.waitForGifReactionCarouselLoaded();
        })
        .then(function () {
          return browser.waitFor(asserters.jsCondition("document.getElementsByClassName('custom_campaign_logo')[0].src.match('ted2_logo') !== null"), global.wd.maxAssertionTimeout);
        })
        .then(function () {
          return browser.waitFor(asserters.jsCondition("document.getElementsByClassName('reaction-gif__item__thumb')[5].src.match('ted2_wtf') !== null"), global.wd.maxAssertionTimeout);
        })
        .then(function () {
          return browser.waitFor(asserters.jsCondition("document.getElementsByClassName('reaction-gif__item__thumb')[6].src.match('ted2_wow') !== null"), global.wd.maxAssertionTimeout);
        })
        .then(function () {
          return browser.waitFor(asserters.jsCondition("document.getElementsByClassName('reaction-gif__item__thumb')[7].src.match('ted2_win') !== null"), global.wd.maxAssertionTimeout);
        })
        .then(function () {
          return browser.waitFor(asserters.jsCondition("document.getElementsByClassName('reaction-gif__item__thumb')[8].src.match('ted2_omg') !== null"), global.wd.maxAssertionTimeout);
        })
        .then(function () {
          return browser.waitFor(asserters.jsCondition("document.getElementsByClassName('reaction-gif__item__thumb')[9].src.match('ted2_fail') !== null"), global.wd.maxAssertionTimeout);
        })
  });

  it("Runs Standard React with a Gif campaign", function () {
      return browser.loadPage(global.wd.bf_url + '/geico/react-with-a-gif?test_date=2016-01-01 00:00:01')
        .then(function() {
          return Bfwd.verifyDocumentIsLoaded(global.wd.maxAssertionTimeout)
        })      
        .then(function () {
          return Post.waitForGifReactionCarouselLoaded();
        })
        .then(function () {
        })        
        .then(function () {
          return Post.expandGigReactionsList();
        })
        .then(function () {
          return Bfwd.moveToElementById('react_gif_carousel_wrapper');
        })              
        .then(function () {
          return browser.waitFor(asserters.jsCondition("document.getElementsByClassName('custom_campaign_logo')[0] == null"), global.wd.maxAssertionTimeout);
        })
        .then(function () {
          return browser.waitFor(asserters.jsCondition("document.getElementsByClassName('reaction-gif__item__thumb')[5].src.match('ted2_wtf') === null"), global.wd.maxAssertionTimeout);
        })
        .then(function () {
          return browser.waitFor(asserters.jsCondition("document.getElementsByClassName('reaction-gif__item__thumb')[6].src.match('ted2_wow') === null"), global.wd.maxAssertionTimeout);
        })
        .then(function () {
          return browser.waitFor(asserters.jsCondition("document.getElementsByClassName('reaction-gif__item__thumb')[7].src.match('ted2_win') === null"), global.wd.maxAssertionTimeout);
        })
        .then(function () {
          return browser.waitFor(asserters.jsCondition("document.getElementsByClassName('reaction-gif__item__thumb')[8].src.match('ted2_omg') === null"), global.wd.maxAssertionTimeout);
        })
        .then(function () {
          return browser.waitFor(asserters.jsCondition("document.getElementsByClassName('reaction-gif__item__thumb')[9].src.match('ted2_fail') === null"), global.wd.maxAssertionTimeout);
        })
      });
  });
});
