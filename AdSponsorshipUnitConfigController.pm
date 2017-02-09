package buzzfeed2::controller::www::AdSponsorshipUnitConfigController;

=pod

=head1 NAME

buzzfeed2::controller::www::AdSponsorshipUnitConfigController

=head1 DESCRIPTION

Contorller for handeling actions from http://www.buzzfeed.com/buzzfeed/ad_sponsorship_unit_config where we can set up a new custom branded React with a 5 GIFs campaign

=head2 FUNCTIONS

=cut

use strict;
use warnings;

use buzzfeed2::JSConst;
use buzzfeed2::model::UserDAO;
use buzzfeed2::model::AdSponsorshipUnitConfigDAO;
use JSON qw(encode_json decode_json);

use base q/buzzfeed2::controller::www::AuthController/;

use constant ACL => 'ad_sponsorship_unit_config_admin';

=head3 auth_execute

Parameters: None (you have access to $self->{cgi} though)

Returns: Nothing (but you can set $self->{json})

=cut

sub auth_execute {
	my ($self) = @_;
	$self->set_root;
	$self->{stash}->{js_includes} = $buzzfeed2::JSConst::JS_INCLUDES;

	unless ( $self->additional_authentication_ok ) {
		$self->_401;
		return;
	}

	my $actions = {
		'show_page'                  => \&_show_page_handler,
		'create_ad_sponsorship_unit' => \&_create_ad_sponsorship_unit_handler
	};
	my $action = $self->{cgi}->param('action') || 'show_page';
	if ( $action && defined $actions->{$action} ) {
		$actions->{$action}($self);
	}
	else {
		die 'Missing or invalid action';
	}
}

=head4 _show_page_handler

Description: Displays page acording to right ACL user

=cut

sub _show_page_handler {
	my ($self) = @_;
	my $cgi    = $self->{cgi};
	my $paths  = $self->getExtraPathInfo;
	my $id = ( ${$paths}[1] ) ? ${$paths}[1] : '';

	$self->{stash}->{id} = $id;
	$self->_show_all_ad_sponsorship_unit();
	$self->{stash}->{ad_sponsorship_unit_info} = encode_json( $self->{stash}->{ad_sponsorship_unit_map} )
	  if ( $id ne '' && defined $self->{stash}->{ad_sponsorship_unit_map} );
	$self->{template} = 'public/ad_sponsorship_unit_config.tt';
}

=head5 _show_all_ad_sponsorship_unit

Description: Displays all campaigns from ad_sponsorship_unit DB table. This function will be altered when we add Edit AdSponsorshipUnit campaign option in later config versions

=begin return_value

sorted_ad_sponsorship_unit_config => [{
	user_id => 265527,
	config => {
		logo => {
			image => "/static/2015-12/16/8/tmp/dev01/39f2180732f26270b1a4c3be6aa14630-0.png",
			width => 215,
			height => 50
		},
		asset => [
			{"asset_name" => "omg.png","image" => "/static/2015-12/16/8/tmp/dev01/c02446b7a28f62f70a81f1ada2fab598-0.png"},
			{"asset_name" => "win.png","image" => "/static/2015-12/16/8/tmp/dev01/c7c86cb679aa4297188388e43f950032-0.png"},
			{"asset_name" => "fail.png","image" => "/static/2015-12/16/8/tmp/dev01/7504792f326c49ffaec530d4ae025826-0.png"},
			{"asset_name" => "omg.gif","image" => "/static/2015-12/16/8/tmp/dev01/anigif_af19b2b955a2cd908ba2e6d570d325a9-0.gif"},
			{"asset_name" => "win.gif","image" => "/static/2015-12/16/8/tmp/dev01/anigif_735f9381f395abf824ddf7af74276da4-0.gif"},
			{"asset_name" => "fail.gif","image" => "/static/2015-12/16/8/tmp/dev01/anigif_0ddc4d7ca2ba95a9f8f321bd751c9651-0.gif"},
			{"asset_name" => "wow.png","image" => "/static/2015-12/16/8/tmp/dev01/3787aef3972e8424ff90fd24073459ed-0.png"},
			{"asset_name" => "wtf.png","image" => "/static/2015-12/16/8/tmp/dev01/690c573f4ff64b6091558b01f1de1175-0.png"},
			{"asset_name" => "wow.gif","image" => "/static/2015-12/16/8/tmp/dev01/anigif_cccf41e3e52487baeb829ccfae9577b1-0.gif"},
			{"asset_name" => "wtf.gif","image" => "/static/2015-12/16/8/tmp/dev01/anigif_63ed0d10a41e1c7834eb111270daca08-0.gif"}
		],
		gif_order => ["wtf","wow","win","omg","fail"]
	},
	start_at => "2015-12-19 23:59:59",
	end_at => "2015-12-13 00:00:01",
	impression_url => "https://ad.doubleclick.net/ddm/trackimp/N201802.131459CRACKLE.COM/B9083639.122958826;dc_trk_aid=295959475;dc_trk_cid=65609519;ord=%n?",
	tracking_url => "https://ad.doubleclick.net/ddm/trackclk/N201802.131459CRACKLE.COM/B9083639.122958826;dc_trk_aid=295959475;dc_trk_cid=65609519"
}]

=end return_value

=cut

sub _show_all_ad_sponsorship_unit {
	my ( $self, $args ) = @_;
	my @sorted_ad_sponsorship_unit_config;
	my $ad_sponsorship_unit_config_service = $self->get_service('AdSponsorshipUnitConfig');
	my $ad_sponsorship_unit_config         = $ad_sponsorship_unit_config_service->get_all();

	#goes throught each campaign retrived from DB
	for my $idx ( @{ $ad_sponsorship_unit_config->{data} } ) {
		my $ad_sponsorship_unit_map;
		my $config_map->{config} = decode_json( $idx->{config} );
		#get advertiser name from its ID
		my $user = buzzfeed2::model::UserDAO->getUserById( { id => $idx->{user_id} } );

		$ad_sponsorship_unit_map->{id}         = $idx->{id};
		$ad_sponsorship_unit_map->{logo}       = $config_map->{config}->{logo};
		$ad_sponsorship_unit_map->{advertiser} = $user->{username};
		$ad_sponsorship_unit_map->{start_at}   = $idx->{start_at};
		$ad_sponsorship_unit_map->{end_at}     = $idx->{end_at};

		push @sorted_ad_sponsorship_unit_config, $ad_sponsorship_unit_map;

		if ( $idx->{id} eq $self->{stash}->{id} ) {
			$self->{stash}->{ad_sponsorship_unit_map} = $idx;
			$self->{stash}->{advertiser}              = $user->{username};
		}
	}

	$self->{stash}->{sorted_ad_sponsorship_unit_config} = \@sorted_ad_sponsorship_unit_config;
	$self->{stash}->{ad_sponsorship_unit_json}          = encode_json($ad_sponsorship_unit_config);
}

=head6 _create_ad_sponsorship_unit_handler

Description: Checks all required parameters for DB, stores them into hash and passes into DB

=begin return_value

$output: { "id": 203 }

=end return_value

=cut

sub _create_ad_sponsorship_unit_handler {
	my ( $self, $args ) = @_;
	my $error;

	foreach (qw(advertiser config start_at end_at)) {
		eval { $args->{$_} = $self->{cgi}->param($_) unless defined $args->{$_}; };
		$error = 'Missing ' . $_ unless defined $args->{$_};
	}
	return $self->{json} = { success => 0, message => $error } if $error;

	foreach (qw(impression_url tracking_url campaign_id)) {
		$args->{$_} = $self->{cgi}->param($_) unless defined $args->{$_};
	}

	my $user = buzzfeed2::model::UserDAO->getUserByUsername( { username => $args->{advertiser} } );
	$user = buzzfeed2::model::UserDAO->getUserById( { id => $args->{advertiser} } ) unless ($user);

	#if we are editing campaign, its id will be passed
	my $campaign_id = $args->{campaign_id} ? $args->{campaign_id} : "";

	if ( $args->{config} ) {
		my $ad_sponsorship_unit_hash = {
			user_id  => $user->{id},
			config   => $args->{config},
			start_at => $args->{start_at},
			end_at   => $args->{end_at},
		};

		foreach (qw(impression_url tracking_url)) {
			$ad_sponsorship_unit_hash->{$_} = $args->{$_} if defined $args->{$_};
		}

		eval {
			my $ad_sponsorship_unit_config_service = $self->get_service('AdSponsorshipUnitConfig');
			my $output                             = $ad_sponsorship_unit_config_service->add(
				{ ad_sponsorship_unit_hash => $ad_sponsorship_unit_hash, campaign_id => $campaign_id } );
			$self->{json} = { success => 1, output => $output };
		};
		if ($@) {
			$self->{json} = { success => 0, message => 'Error saving Ad Sponsorship Unit from hash.' };
		}
	}
	else {
		$self->{json} = { success => 0, message => 'Error saving Ad Sponsorship Unit data. (error publishing data)' };
	}
}

=head7 additional_authentication_ok

Description: Use this if you need to add additional authentication, eg user has p_admin; you'll need to uncomment the
line in auth_execute.

Parameters: None

Returns: 0 || 1

=cut

sub additional_authentication_ok {
	my ( $self, $args ) = @_;

	return $self->user_can(ACL);
}

sub _401 {
	my ( $self, $args ) = @_;
	$self->{body} = 'Unauthorized access';
	return $self->{status} = 401;
}

1;
