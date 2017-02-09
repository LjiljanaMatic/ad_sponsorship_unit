BF_AdSponsorshipUnitCampaign = function() {
	var show_campaign;

	this.templates = { 
		'logo': '<a id="logo_click" href="#{web_root}/#{advertiser}"> <img class="logo custom_campaign_logo" src="#{logo_path}" style= "float: right; margin: 0 25px 5px 0; width:#{logo_width}px; height:#{logo_height}px"/> </a>' 
	};

	this.assign_handlers = function(tracking_url) {
		universal_dom.assign_handler({
			bucket: 'rwg-post',
			handler: function(){ trackPixel(tracking_url); },
			event: 'click'
		});
	};

	/*
	 * Preparing custom RWAG campaings for CMS
	 * @param campaigns (array) - campaigns from DB that begins within two weeks from current date
	 */	
	this.custom_campaigns = function(campaigns) {
        if(BF_STATIC && (BF_STATIC.bf_env == 'stage' || BF_STATIC.bf_env == 'dev') ) {
          console.log('All campaigns passed: ' + JSON.stringify(campaigns));
        }		
		// Prepare data for each campaign
		for(var d in campaigns) {
			// Check if campaign has a flight date
			if(campaigns[d].start_at && campaigns[d].end_at) {
				this.show_campaign = false;
				var config = JSON.parse(campaigns[d].config);
				this.check_condition(campaigns[d].advertiser, campaigns[d].start_at, campaigns[d].end_at);

				if(this.show_campaign == true) {
					this.insert_assets(config.gif_order, config.asset);
					this.insert_logo(campaigns[d].advertiser, config.logo, campaigns[d].impression_url);
					this.assign_handlers(campaigns[d].tracking_url);
				};
			};
		};
	};

	/*
	 * Condition for custom RWAG campaings
	 * @param advertiser (string) - user account
	 * @param start_flight (string) - start flight date for campaign
	 * @param end_flight (string) - end flight date for campaign
	 * sets show_campaign as true if condition is set
	 */

	this.check_condition = function(advertiser, start_flight, end_flight) {

		if(window.buzzDetails.nsfw == 0 && (!window.BF_STATIC.f_ad || window.BF_STATIC.username == advertiser)) {
			var current_date = bfjs.getUrlVars()['test_date'] ? Date.parse( decodeURIComponent(bfjs.getUrlVars()['test_date'].replace(/-/g, "/")) ) : Date.parse(Date());
			var start_date = Date.parse(start_flight.replace(/-/g, "/"));
			var end_date = Date.parse(end_flight.replace(/-/g, "/"));

			if( (current_date >= start_date) && (current_date <= end_date) ) {
				this.show_campaign = true;
			};
		};
	};

	/*
	 * Reorders assets (gifs and static images) acording to gif order provided in RWAG builder
	 * and populates two global arrays available for react_with_gif.js carousel wrapper to pick them up
	 * @param gif_order (array) - gif order defined in RWAG builder
	 * @param asset (array) - static images and gifs for RWAG carousel
	 */

	this.insert_assets = function(gif_order, asset) {
		rwg.gif_array = [];
		rwg.image_array = [];

		for(var i = 0; i < gif_order.length; i++) {

			for(var j = 0; j < asset.length; j++) { 

				if (asset[j].asset_name.match(new RegExp( '\\b' + gif_order[i] + '\\b', 'i'))) {
					if(asset[j].asset_name.match(new RegExp(/.gif$/))){
						rwg.gif_array.push(asset[j].image);
					} else {
						rwg.image_array.push(asset[j].image);
					}
				};
			};
		};
	};

	/*
	 * Inserts campaign "Promoted By" logo above carousel
	 * @param advertiser (string) - user account
	 * @param logo (object) - logo path, width and height
	 */

	this.insert_logo = function(advertiser, logo, impression) {
		var wrapper 	= $('react_gif_carousel_wrapper'),
		  logo_data 	= {
			advertiser:  advertiser,
			logo_path:   (BF_STATIC.image_root + logo.image),
			logo_width:  logo.width,
			logo_height: logo.height
		};

		wrapper.addClassName('open');
		wrapper.setStyle({ 'padding': '0 0 60px 0'});
		wrapper.insert({top: new Template(this.templates.logo).evaluate(logo_data)} );
		gtrack.track_events("[ttp]:reactions", "[nc]reaction-gif-bar-impression", "", "", "");

		// Insert impression pixel if available
		if(impression && typeof impression !== 'undefined' && impression.trim().length > 0) {
			trackPixel(impression);
		}
	};

	/*
	 * Fires impression tracking when user scrolles down to "Promoted By" logo
	 */

	this.logo_view_tracking = function() {
		if(!rwg.logo_view_tracked) {
			var userGeo = document.documentElement.scrollTop + document.body.scrollTop;
			if(userGeo > gtrack.shareTop && gtrack.shareTop != 0){
				gtrack.track_events('[ttp]:reactions','[nc]reaction-gif-bar-view', '', '', '');
				rwg.logo_view_tracked = true;
			}
		}
	};
};
