var path = require('path');
var wd = require('wd');
var Bfwd = require('../lib/bfwd');
var BfRunner = require('../lib/bf-runner');
var browser = global.wd.browser;
var asserters = wd.asserters;

describe(path.basename(__filename), function() {
  describe("Ad Sponsorship Unit Config Uploader Suite", function() {

    // SETUP
    beforeEach(function() {
      return BfRunner.loadFixture("sel2_internal_tools_ad_sponsorship_unit");
    });

    // TEAR DOWN
    afterEach(function() {
      return BfRunner.tearDown();
    });

    it("Page Accessible", function() {
      return BfRunner.signin('admin_user', 'password')
        .then(function() {
          return browser.loadPage(global.wd.bf_url + '/ad_sponsorship_unit_config');
        })
        .then(function() {
          return browser.waitForElementById('rwag-config__form', asserters.isDisplayed);
        })
    });

    it("Warns Missing Logo", function () {
      return BfRunner.signin('admin_user', 'password')
        .then(function () {
          return browser.loadPage(global.wd.bf_url + '/ad_sponsorship_unit_config');
        })
        .then(function () {
          return Bfwd.clickElementById("rwag-config__submit");
        })
        .then(function () {
          return Bfwd.assertTextById("rwag-config__error", "error: Please upload custom RWAG 'Promoted by' logo");
        })
    });

    it("Upload Too Small Rwag Logo", function () {
      return BfRunner.signin('admin_user', 'password')
        .then(function () {
          return browser.loadPage(global.wd.bf_url + '/ad_sponsorship_unit_config');
        })  
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-logo-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/logo200x50.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function () {
          return Bfwd.assertTextById("rwag-config__error", 'error: "Promoted By" Logo must be exactly 215px * 50px.');
        })
    });

    it("Upload Proper Sized Rwag Logo And Warn Missing Assets", function () {
      return BfRunner.signin('admin_user', 'password')
        .then(function () {
          return browser.loadPage(global.wd.bf_url + '/ad_sponsorship_unit_config');
        })  
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-logo-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/logo215x50.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })
        .then(function () {
          return Bfwd.clickElementById("rwag-config__submit");
        })            
        .then(function () {
          return Bfwd.assertTextById("rwag-config__error", 'error: You need to upload 10 static and reaction assets');
        })
    });

    it("Upload 10 Assets And Warn Missing GIF Order", function () {
      return BfRunner.signin('admin_user', 'password')
        .then(function () {
          return browser.loadPage(global.wd.bf_url + '/ad_sponsorship_unit_config');
        })  
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-logo-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/logo215x50.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/fail.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/fail.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/omg.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/omg.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/win.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/win.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wow.png");
        })
        .then(function () {
          return Bfwd.verifyDocumentIsLoaded(global.wd.longAssertionTimeout);
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wow.gif");
        })
        .then(function () {
          return Bfwd.verifyDocumentIsLoaded(global.wd.longAssertionTimeout);
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wtf.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wtf.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })
        .then(function () {
          return Bfwd.clickElementById("rwag-config__submit");
        })            
        .then(function () {
          return Bfwd.assertTextById("rwag-config__error", 'error: Please specify gif order in carousel');
        })
    });

    it("Define GIF Order That Doesn't Match Asset Names And Warn", function () {
      return BfRunner.signin('admin_user', 'password')
        .then(function () {
          return browser.loadPage(global.wd.bf_url + '/ad_sponsorship_unit_config');
        })  
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-logo-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/logo215x50.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/fail.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/fail.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/omg.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/omg.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/win.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/win.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wow.png");
        })
        .then(function () {
          return Bfwd.verifyDocumentIsLoaded(global.wd.longAssertionTimeout);
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wow.gif");
        })
        .then(function () {
          return Bfwd.verifyDocumentIsLoaded(global.wd.longAssertionTimeout);
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wtf.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wtf.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })
        .then(function () {
          return Bfwd.setInputById("rwag-config-gif-order", "fail, omg, wowy, win, wtf");
        })        
        .then(function () {
          return Bfwd.clickElementById("rwag-config__submit");
        })            
        .then(function () {
          return Bfwd.assertTextById("rwag-config__error", 'error: Please match gif order with uploaded file names.');
        })
    });

    it("Define Right GIF Order And Warn Missing Advertiser", function () {
      return BfRunner.signin('admin_user', 'password')
        .then(function () {
          return browser.loadPage(global.wd.bf_url + '/ad_sponsorship_unit_config');
        })  
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-logo-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/logo215x50.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/fail.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/fail.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/omg.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/omg.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/win.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/win.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wow.png");
        })
        .then(function () {
          return Bfwd.verifyDocumentIsLoaded(global.wd.longAssertionTimeout);
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wow.gif");
        })
        .then(function () {
          return Bfwd.verifyDocumentIsLoaded(global.wd.longAssertionTimeout);
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wtf.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wtf.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })
        .then(function () {
          return Bfwd.setInputById("rwag-config-gif-order", "fail, omg, wow, win, wtf");
        })        
        .then(function () {
          return Bfwd.clickElementById("rwag-config__submit");
        })            
        .then(function () {
          return Bfwd.assertTextById("rwag-config__error", 'error: Please specify advertiser user account');
        })
    });

    it("Define Advertiser And Warn Missing Flight Date", function () {
      return BfRunner.signin('admin_user', 'password')
        .then(function () {
          return browser.loadPage(global.wd.bf_url + '/ad_sponsorship_unit_config');
        })  
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-logo-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/logo215x50.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/fail.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/fail.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/omg.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/omg.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/win.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/win.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wow.png");
        })
        .then(function () {
          return Bfwd.verifyDocumentIsLoaded(global.wd.longAssertionTimeout);
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wow.gif");
        })
        .then(function () {
          return Bfwd.verifyDocumentIsLoaded(global.wd.longAssertionTimeout);
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wtf.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wtf.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })
        .then(function () {
          return Bfwd.setInputById("rwag-config-gif-order", "fail, omg, wow, win, wtf");
        })
        .then(function () {
          return Bfwd.setInputById("rwag-config-advertiser", "admin_user");
        })
        .then(function () {
          return Bfwd.clickElementById("rwag-config__submit");
        })            
        .then(function () {
          return Bfwd.assertTextById("rwag-config__error", 'error: Please specify start and end date for the campaign');
        })
    });

    it("Add Flight Date And Successfuly Submit Campaign", function () {
      return BfRunner.signin('admin_user', 'password')
        .then(function () {
          return browser.loadPage(global.wd.bf_url + '/ad_sponsorship_unit_config');
        })  
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-logo-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/logo215x50.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/fail.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/fail.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/omg.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/omg.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/win.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/win.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wow.png");
        })
        .then(function () {
          return Bfwd.verifyDocumentIsLoaded(global.wd.longAssertionTimeout);
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wow.gif");
        })
        .then(function () {
          return Bfwd.verifyDocumentIsLoaded(global.wd.longAssertionTimeout);
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wtf.png");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })        
        .then(function (el) {
          return Bfwd.setFileInputByCss("#js-asset-upload_dragdrop_dynamic_fields .qq-upload-button input", "/buzzfeed/webapp/t/data/images/ad_sponsorship_unit_campaign/wtf.gif");
        })
        .then(function () {
          return BfRunner.waitForAjaxResponseCode('/buzzfeed/_edit_super_image/wide', global.wd.maxAssertionTimeout);
        })
        .then(function () {
          return Bfwd.setInputById("rwag-config-gif-order", "fail, omg, wow, win, wtf");
        })
        .then(function () {
          return Bfwd.setInputById("rwag-config-advertiser", "admin_user");
        })
        .then(function () {
          return Bfwd.isNotVisibleByCss(".daterangepicker");
        })
        .then(function () {
          return Bfwd.clickElementById("rwag-config-flight");
        })
        .then(function () {
          return browser.waitForElementByCss('.daterangepicker', asserters.isDisplayed);
        })
        .then(function () {
          return Bfwd.clickElementByCss(".daterangepicker .left .icon-arrow-right");
        })
        .then(function () {
          return Bfwd.clickElementByCss(".daterangepicker .left .icon-arrow-right");
        })                
        .then(function () {
          return Bfwd.clickElementByCss(".daterangepicker .left td[rel~='r1c0']");
        })
        .then(function () {
          return Bfwd.clickElementByCss(".daterangepicker .right .icon-arrow-right");
        })
        .then(function () {
          return Bfwd.clickElementByCss(".daterangepicker .right .icon-arrow-right");
        })              
        .then(function () {
          return Bfwd.clickElementByCss(".daterangepicker .right td[rel~='r1c6']");
        })
        .then(function () {
          return Bfwd.clickElementByCss(".daterangepicker .applyBtn");
        })
        .then(function () {
          return browser.waitForElementById('rwag-config-flight-info', asserters.isDisplayed);
        })
        .then(function () {
          return Bfwd.clickElementById("rwag-config__submit");
        })         
        .then(function () {
          return browser.waitFor(asserters.jsCondition("document.getElementById('rwag-config__result').innerHTML.search('Success') >= 0", global.wd.secretmaxAssertionTimeout), global.wd.secretmaxAssertionTimeout, 100);
        })
    });
  });
});
