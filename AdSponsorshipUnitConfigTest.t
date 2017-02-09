package t::Service::AdSponsorshipUnitConfigTest;

use strict;
use warnings;

use lib qw( t lib extlib );
use base qw( t::Test );

# test modules
use Test::More;
use Test::Exception;
use Test::MockModule;
use Test::MockObject;
use Test::MockObject::Extends;
use Test::Deep;
# external modules
use Pod::Coverage;

# local modules
use BFTestUtil;
use buzzfeed2::fixture::Builder;
use buzzfeed2::util::ServiceDocs;
use buzzfeed2::model::CategoryDAO;

# what we're testing
sub test_module { 'buzzfeed2::Service::AdSponsorshipUnitConfig' }

sub startup : Test(startup => +1) {
	my ($self) = @_;

	# run parent's startup first
	$self->SUPER::startup;
	use_ok(test_module);
	$self->{dbh} = buzzfeed2::model::BFDB->connect();
	return;
}

#
# tests
#

sub add_required_args : Tests {
	my ( $self, $args ) = @_;

	throws_ok( sub { test_module->add( ) }, qr/Requires a ad_sponsorship_unit_hash/, 'Requires a ad_sponsorship_unit_hash' );
}

sub add_success : Tests {
	my ( $self, $args ) = @_;

	my $buzzdao = Test::MockModule->new('buzzfeed2::model::AdSponsorshipUnitConfigDAO');
	$buzzdao->mock(
		'_add_ad_sponsorship_unit_config_entry_from_hash', sub {
			my ( $self, $args ) = @_;
			return 1234;
		}
	);

	my $ad_sponsorship_unit_hash = {		
		user_id        => 212423,
		config         => [{ gif_order => ["wtf","win","omg","lol","fail"] }],
		start_at       => '2015-12-20 00:00:01',
		end_at         => '2015-12-26 23:59:59',
		impression_url => 'impression',
		tracking_url   => 'click_tracking', 
	};

	my $res = test_module->add( { ad_sponsorship_unit_hash => $ad_sponsorship_unit_hash } );
	ok( $res->{success}, 'Ad Sponsorship Unit campaign added' );
	is( $res->{id}, 1234, 'Correct id' );
}

sub get_all_success : Tests {
	my ($self) = @_;
	my $ad_sponsorship_unit_config = {
		user_id => 265527,
		config => {
			logo => {
				image => "/static/2015-12/16/8/tmp/dev01/39f2180732f26270b1a4c3be6aa14630-0.png",
				width => 215,
				height => 50
			},
			asset => [
				{asset_name => "omg.png", image => "/static/2015-12/16/8/tmp/dev01/c02446b7a28f62f70a81f1ada2fab598-0.png"},
				{asset_name => "win.png", image => "/static/2015-12/16/8/tmp/dev01/c7c86cb679aa4297188388e43f950032-0.png"}
			],
			gif_order => ["wtf","wow","win","omg","fail"],
			advertiser => "tedisreal"
		},
		start_at => "2015-12-19 23:59:59",
		end_at => "2015-12-13 00:00:01",
		impression_url => "https://ad.doubleclick.net/ddm/trackimp/N201802.131459CRACKLE.COM/B9083639.122958826;dc_trk_aid=295959475;dc_trk_cid=65609519;ord=%n?",
		tracking_url => "https://ad.doubleclick.net/ddm/trackclk/N201802.131459CRACKLE.COM/B9083639.122958826;dc_trk_aid=295959475;dc_trk_cid=65609519"
	};

	my $adsponsorhipunitconfigdao = Test::MockModule->new('buzzfeed2::model::AdSponsorshipUnitConfigDAO');
	$adsponsorhipunitconfigdao->mock(
		'get_all_ad_sponsorship_unit_configs', sub {
			my ( $self, $args ) = @_;
			return $ad_sponsorship_unit_config;
		}
	);

	my $res = test_module->get_all();
	is( $res->{success}, 1, 'Success!' );
	ok( $res->{user_id}, 'got a user_id' );	
	ok( $res->{config}, 'got a config' );
	ok( $res->{start_at}, 'got an start_at' );
	ok( $res->{end_at}, 'got an end_at' );
	ok( $res->{impression_url}, 'got impression_url' );
	ok( $res->{tracking_url}, 'got tracking_url' );

}

1;
