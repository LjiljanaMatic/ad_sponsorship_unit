package buzzfeed2::controller::public::plugin::Adsponsorshipunitconfig;

=pod

=head1 NAME

buzzfeed2::controller::public::plugin::Adsponsorshipunitconfig

=head1 DESCRIPTION

Plugin for getting active React with 5 GIFS campaigns and making them available for CMS.

=head2 FUNCTIONS

=cut

use strict;
use warnings;

use Error qw(:try);
use Date::Parse 'str2time';

use base 'buzzfeed2::controller::public::plugin::PublisherPlugin';

use buzzfeed2::model::AdSponsorshipUnitConfigDAO;

use constant TEMPLATE => 'public/plugin/_ad_sponsorship_unit-campaign.tt';

=head3 B<get_data>

Description: Gets all active React w/a GIF campaigns from ad_sponsorship_unit DB table and passes all campaigns that satisfies condition of current time is smaller than the end date but that the start date is within the next 2 weeks or that campaign started in previous 7 days.
This is to allow us to test a campaign that is scheduled in the next 2 weeks with test_date= and not to interfeer with the one that is currently running

=begin return_value

ad_sponsorship_unit_campaigns: [{
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

sub get_data {
	my ( $self, $args ) = @_;
	my %configs;
	my $current_time = time();
	my $i = 0;

	my $ad_sponsorship_unit_config_service = buzzfeed2::Service->get_service('AdSponsorshipUnitConfig');
	my $ad_sponsorship_unit_config = $ad_sponsorship_unit_config_service->get_active();

	#goes throught each campaign retrived from DB
	foreach my $idx ( @{ $ad_sponsorship_unit_config->{data} } ) {
		#get advertiser name from its ID
		my $user = buzzfeed2::model::UserDAO->getUserById( { id => $idx->{user_id} } );
		$idx->{advertiser} = $user->{username} if defined $user->{username};

		my $start_time = str2time( $idx->{start_at} );
		my $end_time   = str2time( $idx->{end_at} );
		if ( ($current_time < $end_time && ( $current_time + ( 86400 * 14 ) ) > $start_time) || ($current_time - ( 86400 * 7 ) ) <= $start_time ) {
			$configs{$i} = $idx;
			$i++;
		};
	};

	eval { $self->{stash}->{ad_sponsorship_unit_campaigns} = \%configs };
	$self->{stash}->{ad_sponsorship_unit_campaigns} = {} if $@;

	return 1;
};

1;