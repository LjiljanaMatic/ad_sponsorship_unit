BF_AdSponsorshipUnitConfig = function() {
	this.ad_sponsorship_unit_config_controller = '/buzzfeed/ad_sponsorship_unit_config';
	this.date_picker_params;
	this.flight_template = '<span class="flight_time"><span class="flight_start">#{start_date}</span> to <span class="flight_end">#{end_date}</span></span><a id="#{flightid}_edit" class="flight_edit btn-mini">Edit</a><a class="flight_delete btn-mini bf_dom" rel:bf_bucket_data=\'{"remove-flight":{"flightid":"#{flightid}"}}\' onclick="return false" href="javascript:;">Remove</a>';	
	var total_flights = 0;
	var uploaded_assets = [];
	var uploaded_logo = {};
	var _this = this;

	this.init = function() {
		if(!acl.user_can('ad_sponsorship_unit_config_admin')) return;
		this.make_logo_uploader();
		this.make_asset_uploader();
		this.initialize_date_picker();
		this.initialise_flight_adder();
		this.show_existing_campaign();
		this.assign_handlers();
	};

	this.assign_handlers = function() {
		universal_dom.assign_handler({
			bucket:'rwag-config-submit',
			handler:_this.validate_and_submit,
			event:'click'
		});
		universal_dom.assign_handler({
			bucket:'remove-flight',
			handler:_this.remove_flight,
			event:'click'
		});
		universal_dom.assign_handler({
			bucket:'remove-assets',
			handler:_this.remove_assets,
			event:'click'
		});			
	};

	this.initialize_date_picker = function() {
		_this.date_picker_params = {
			opens: 'right',
			format: 'MM/dd/yyyy',
			startDate: Date.today(),
			endDate: Date.today(),
			separator: ' to ',
			minDate: Date.today().add(-1).months(),
			maxDate: Date.today().add(6).months(),
			locale: { clearLabel: 'Cancel' },
			noRangeWarning: true
		}
	};

	this.initialise_flight_adder = function() {
		jQuery('#rwag-config-flight').daterangepicker(_this.date_picker_params, function(start, end) {
			_this.create_flight('rwag_container', start, end);
			$("rwag-config-flight-info").show();
		});
	};

	this.create_flight = function(container, start, end) {
		var flightid = 'flight_' + total_flights;
		var div = document.createElement('div');
		div.setAttribute('id', flightid);
		div.addClassName('flight');
		$(container).appendChild(div);
		_this.edit_flight(flightid, start, end);
		universal_dom.update(flightid);
		total_flights++;
	};

	this.edit_flight = function(flightid, start, end) {
		if($(flightid)){
			var obj = {
				'start_date': start.toString('yyyy-MM-dd'),
				'end_date': end.toString('yyyy-MM-dd'),
				'flightid': flightid
			};
			var flight_template = new Template(_this.flight_template);
			$(flightid).innerHTML = flight_template.evaluate(obj);
			universal_dom.update(flightid);
			_this.date_picker_params.startDate = start;
			_this.date_picker_params.endDate = end;
			jQuery('#' + flightid + '_edit').daterangepicker(_this.date_picker_params,
			function(start, end) {
				$('start_date').innerHTML = start.toString('yyyy-MM-dd');
				$('end_date').innerHTML = end.toString('yyyy-MM-dd');
				_this.edit_flight(flightid, start, end);
			});
		}
	};

	this.remove_flight = function(args) {
		if(args.flightid){
			$$(".flight").each(function (el) {
				if(el.id && el.id == args.flightid){
					el.remove();
				}
			});
		}
		_this.hide_flight_containers();
	};

	this.hide_flight_containers = function() {
		if( !(_this.get_flights()) ){
			$("rwag-config-flight-info").hide();
			$('rwag-config-flight').innerHTML = "Add a flight start and end date";
		}
	};

	this.get_flights = function() {
		var flight_obj = {};
		if($('rwag_container')){
			$$('#rwag_container .flight').each(function(el){
				var start_date = $$('#' + el.id + ' .flight_time .flight_start')[0].innerHTML.split(" ",1)[0] + " 00:00:01";
				var end_date = $$('#' + el.id + ' .flight_time .flight_end')[0].innerHTML.split(" ",1)[0] + " 23:59:59";
				if(start_date && end_date) {
					flight_obj = {
						'start_date': start_date,
						'end_date': end_date
					};
				};			
			});
		}
		if(JSON.stringify(flight_obj) === '{}') {
			return null;
		} else {
			return flight_obj;
		}		
	};

	this.remove_assets = function() {
		document.getElementById("asset-upload__list").innerHTML = "";
		uploaded_assets = [];
	};

	this.make_asset_uploader = function() {
		var uploader_options = {
			element: $("js-asset-upload_dragdrop_dynamic_fields"),
			action: '/buzzfeed/_edit_super_image/wide',
			multiple: false,
			// Fix failure for uploading multiple images
			retry: {
        		enableAuto: true
    		},   		
			dropElement: $("asset-upload__holder"),
			listElement: $("asset-upload__list"),
			template: '<div class="qq-uploader">' +
				'<a type="button" class="qq-upload-button">Upload Assets</a>' +
				'<ul class="qq-upload-list" style="display:none;"></ul>' +
				'</div>',
			debug: false,
			allowedExtensions: ['jpg', 'jpeg', 'png', 'gif'],
			sizeLimit: 1024 * 1024 * 5,
			maxConnections: 10,
			params: {
				action: 'imageupload'
			},
			onSubmit: function() {
				_this.clear_errors();
			},			
			onComplete: function(id, image_name, o) {
				o.asset_name = image_name;
				uploaded_assets.push(o);	
			},
			onError: function() {
				_this.hide_image_spinner();
				_this.error('Upload failed. Please make sure you have the right size and format.');
				return false;
			},
		}
		var uploader = new qq.FileUploader(uploader_options);
	};

	this.make_logo_uploader = function() {
		var uploader_options = {
			element: $("js-logo-upload_dragdrop_dynamic_fields"),
			action: '/buzzfeed/_edit_super_image/wide',
			multiple: false,
			dropElement: $("logo-upload__holder"),
			template: '<div class="qq-uploader">' +
				'<a type="button" class="qq-upload-button">Upload Logo</a>' +
				'<ul class="qq-upload-list" style="display:none;"></ul>' +
				'</div>',
			debug: false,
			allowedExtensions: ['jpg', 'jpeg', 'png'],
			params: {
				action: 'imageupload'
			},
			onSubmit: function() {
				_this.show_image_spinner();
				_this.clear_errors();
			},
			onComplete: function(id, image_name, o) {
				_this.hide_image_spinner();
				if (o.width != 215 || o.height != 50 ) {
					_this.error('"Promoted By" Logo must be exactly 215px * 50px.');
					return false;
				}
				_this.show_logo(o);
				uploaded_logo = o;
				$('logo-upload__size').hide();
			},
			onError: function() {
				_this.hide_image_spinner();
				_this.error('Upload failed. Please make sure you have the right size and format.');
				return false;
			},
		}
		var uploader = new qq.FileUploader(uploader_options);
	};

	this.show_logo = function(image_data) {
		var logo = $('logo-upload--preview');
		logo.show();
		try {
			if(logo){
				logo.src = BF_STATIC.image_root + image_data.image;
			}
		} catch (err) {
			console.error(err);
		}
	};

	this.validate_and_submit = function() {
		if(_this.validate()){
			_this.show_image_spinner();
			var assets_array 		= [];
			var gif_order 			= $('rwag-config-gif-order').value.split(/[ ,]+/);
			var advertiser 			= $('rwag-config-advertiser').value;
			var impression 			= $('rwag-config-impression').value;
			var click_tracking 		= $('rwag-config-click').value;
			var flights 			= _this.get_flights();
			var ad_sponsorship_unit_info = $('ad_sponsorship_unit_info');

			for(var i = 0; i < uploaded_assets.length; i++) {
				var parameters = {
					'asset_name': 	uploaded_assets[i].asset_name,
					'image': 		uploaded_assets[i].image,
				}
				assets_array.push(parameters);
			};

			var config = {
				logo: {
				  'image': 	uploaded_logo.image,
				  'width': 	uploaded_logo.width,
				  'height': uploaded_logo.height
				},
				asset: 		assets_array,
				gif_order: 	gif_order
			};

			var params = {
				action: 	'create_ad_sponsorship_unit',
				advertiser: advertiser,
				config: 	JSON.stringify(config),
				start_at: 	flights.start_date,
				end_at: 	flights.end_date 
			};

			if(ad_sponsorship_unit_info) {
				var campaign_info = (ad_sponsorship_unit_info.innerHTML).evalJSON();
				params.campaign_id = campaign_info.id;
			}

			if(impression) params.impression_url = impression;
			if(click_tracking) params.tracking_url = click_tracking;

			(new BF_Request()).request(_this.ad_sponsorship_unit_config_controller,{
				method: 'post',
				parameters: params,
				onSuccess:function(r){
					var json = r.responseText;
					var obj = json.evalJSON();
					if ( obj.success == 0 ){
						_this.error(obj.message  || 'RWAG Config: error adding custom RWAG campaign');
					} else if( obj.output && $('rwag-config__result') ){
						_this.display_result("<em>Success!</em>&nbsp;<strong> RWAG ID: " + obj.output.id + " </strong>&nbsp;Changes may take up to 10 min to appear.");
						_this.clear_form();
						setTimeout(function() { location.reload();}, 30000);
					}else{
						_this.display_result("Success!");
						_this.clear_form();
						setTimeout(function() { location.reload();}, 30000);
					}
					_this.hide_image_spinner();
				},
				onFailure: function(r) {
					var json = r.responseText;
					var obj = (json) ? json.evalJSON() : {};
					_this.error(obj.message || 'RWAG Config: error adding custom RWAG campaign');
					_this.hide_image_spinner();
				},
				onError: function(r) {
					var json = r.responseText;
					var obj = (json) ? json.evalJSON() : {};
					_this.error(obj.message || 'RWAG Config: error adding custom RWAG campaign');
					_this.hide_image_spinner();
				}				
			});
		};
	};

	this.validate = function() {
		_this.clear_errors();
		if(!uploaded_logo || uploaded_logo.image_path === undefined && (uploaded_logo.image === undefined || uploaded_logo.width === undefined || uploaded_logo.height === undefined)) {
			_this.error("Please upload custom RWAG 'Promoted by' logo");
			return false;
		};

		if(!(uploaded_assets.length == 10)) {
			_this.error("You need to upload 10 static and reaction assets");
			return false;
		};

		if($('rwag-config-gif-order').value == "") {
			_this.error("Please specify gif order in carousel");
			return false;
		};

		//Check gif order with uploaded file names
		var gif_order = $('rwag-config-gif-order').value.split(/[ ,]+/);
		for(var j = 0; j < uploaded_assets.length; j++) { 
			if (!(uploaded_assets[j].asset_name.match(new RegExp( '\\b' + gif_order.join('\\b|\\b') + '\\b', 'i')))) {
				_this.error("Please match gif order with uploaded file names.");
				return false;
			};
		};

		if($('rwag-config-advertiser').value == "") {
			_this.error("Please specify advertiser user account");
			return false;
		};

		if( !(_this.get_flights()) ){
			_this.error("Please specify start and end date for the campaign");
			return false;
		};

		var new_flight = _this.get_flights(),
		  compareStartDate = moment(new_flight.start_date),
		  compareEndDate = moment(new_flight.end_date),
		  flights_start = $$('.rwag__start-at .enabled'),
		  flights_end = $$('.rwag__end-at .enabled');

		for(var i = 0; i < flights_start.length; i++) {
			var startDate = moment(flights_start[i].innerHTML);
			var endDate = moment(flights_end[i].innerHTML);

			if( compareStartDate.isBefore(endDate) && compareEndDate.isAfter(startDate) || (compareStartDate.isSame(endDate) || compareEndDate.isSame(startDate)) ){
				_this.error("Flight date is already used by another campaign. Please change the dates");
				return false;
			};
		};

		return true;
	};

	this.show_existing_campaign = function() {
		var ad_sponsorship_unit_info = $('ad_sponsorship_unit_info');

		if(ad_sponsorship_unit_info && ad_sponsorship_unit_info.innerHTML){
			var campaign_info = (ad_sponsorship_unit_info.innerHTML).evalJSON();
			var campaign_info_config = campaign_info.config.evalJSON();
			var asset_upload_list = $('asset-upload__list');

			this.show_logo(campaign_info_config.logo);
			uploaded_logo = campaign_info_config.logo;
			$('logo-upload__size').hide();

			for(var i = 0; i < campaign_info_config.asset.length; i++) {
				var li = document.createElement('li');
				li.className = "qq-upload-success";
				var span = document.createElement('span');
				span.innerHTML = campaign_info_config.asset[i].asset_name;
				li.appendChild(span);
				asset_upload_list.appendChild(li);

				uploaded_assets.push(campaign_info_config.asset[i]);
			}
			$('rwag-config-gif-order').value = campaign_info_config.gif_order;
			$('rwag-config-advertiser').value = ad_sponsorship_unit_info.className;
			//Disable changing advertiser for edit option
			$('rwag-config-advertiser').style = "pointer-events: none";
			this.create_flight('rwag_container', campaign_info.start_at, campaign_info.end_at);
			$("rwag-config-flight-info").show();			

			if(campaign_info.impression_url) {
				$('rwag-config-impression').value = campaign_info.impression_url;
			}
			if(campaign_info.tracking_url) {
				$('rwag-config-click').value = campaign_info.tracking_url;
			}					
		}
	};

	this.clear_form = function() {
		$('logo-upload--preview').hide();
		$('logo-upload__size').show();
		jQuery('.qq-upload-success').remove()
		var clearFields = ["rwag-config-gif-order", "rwag-config-advertiser", "rwag-config-impression", "rwag-config-click"];
		clearFields.forEach(function(field) {
			if($("" + field) && $("" + field).value ){
				$("" + field).value = "";
			}
		});
		$$('.flight').each(function(element) {
			element.parentNode.removeChild(element);
		});
		_this.hide_flight_containers();
		_this.initialize_date_picker();
		uploaded_logo = {};
		uploaded_assets.length = 0;
	};

	this.show_image_spinner = function() {
		$$('.image_spinner').each(function(el) { el.show(); });
	};

	this.hide_image_spinner = function() {
		$$('.image_spinner').each(function(el) { el.hide(); });
	};

	this.clear_errors = function(message) {
		if($('rwag-config__error')){
			$('rwag-config__error').innerHTML = "";
		}
	};

	this.error = function(message) {
		if($('rwag-config__error')){
			$('rwag-config__error').innerHTML = "error: " + message;
		}
		(new BF_Request()).alert(message);
	};

	this.display_result = function(message) {
		var result = $('rwag-config__result');
		if(result){
			result.innerHTML = message;
			result.show();
		};
	};
};

var ad_sponsorship_unit_config = new BF_AdSponsorshipUnitConfig();
BuzzLoader.register(function() {
	ad_sponsorship_unit_config.init();
}, 1);
