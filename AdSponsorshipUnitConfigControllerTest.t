package t::controller::www::AdSponsorshipUnitConfigControllerTest;

use strict;
use warnings;

use lib qw( t lib extlib );
use base qw( t::Test );

# test modules
use Test::More;
use Test::Exception;
use Test::MockModule;
use Test::MockObject::Extends;

# local modules
use BFTestUtil;
use buzzfeed2::fixture::Builder;
use buzzfeed::mvc::ControllerMapping;
use buzzfeed2::model::ReservedUsernames;
use buzzfeed2::controller::BFAuthController;

use Data::Dump qw(dump);
use JSON qw/decode_json/;

# what we're testing
sub test_module { 'buzzfeed2::controller::www::AdSponsorshipUnitConfigController' }

#
# startup/shutdown
#

sub startup : Test( startup => +1 ) {
	my ($self) = @_;

	# run parent's startup first
	$self->SUPER::startup;
	use_ok(test_module);
	return;
}

#
# setup/teardown
#

sub setup : Test(setup) {
	my ($self) = @_;

	# run parent's setup first
	$self->SUPER::setup;
	$self->{dbh}     = buzzfeed2::model::BFDB->connect;
	$self->{session} = BFTestUtil->create_session;
	return;
}

sub teardown : Test(teardown) {
	my ($self) = @_;
	BFTestUtil->destroy_session;
	$self->{session} = undef;
	$self->{dbh}->disconnect;

	# run parent's teardown last
	$self->SUPER::teardown;
	return;
}

#
# tests
#

sub isa_www_controller : Test {
	my ($self) = @_;
	my $obj = bless {}, test_module;
	isa_ok( $obj, 'buzzfeed2::controller::www::AuthController' );
	return;
}

sub can_auth_execute : Test {
	my ($self) = @_;
	can_ok( test_module, 'auth_execute' );
	return;
}

sub invalid_action_mapping : Tests {
	my ($self) = @_;
	my $controller = $self->controller;
	$controller->{user} = { p_admin => 1 };
	my $expected = qr/missing or invalid action/i;

	$controller->{cgi} = new CGI();
	ok( sub { $controller->auth_execute }, 'no action defaults to show_page' );

	$controller->{cgi} = new CGI( { action => 'badaction' } );
	throws_ok( sub { $controller->auth_execute }, $expected, 'bad action' );
	return;
}

sub valid_actions_ok : Tests {
	my ($self) = @_;
	my $controller = $self->controller;
	my $ad_sponsorship_unit_config_admin = $self->mock_acls( { $controller->{user}->{id} => ['ad_sponsorship_unit_config_admin'] } );

	my @valid_actions = qw( show_page create_ad_sponsorship_unit );

	foreach (@valid_actions) {
		if ( $_ eq 'create_ad_sponsorship_unit' ) {
			$controller->{cgi} =
			  new CGI(
				{ action => $_, advertiser => 'geico', config => { gif_order => ["wtf","win","omg","lol","fail"] }, start_at => '2015-12-20 00:00:01', end_at => '2015-12-26 23:59:59', } );
		}
		else {
			$controller->{cgi} = new CGI( { action => $_ } );
		}
		lives_ok( sub { $controller->auth_execute }, "$_ action OK" );
	}
	return;
}

sub incorrect_permissions_401 : Tests {
	my ($self) = @_;
	my $controller = $self->controller;
	$controller->{cgi} = new CGI( { action => 'show_page', } );
	lives_ok( sub { $controller->auth_execute }, "show_page action OK" );
	is( $controller->{status}, 401, "401 without correct acl permission" );
}

sub correct_permissions_200 : Tests {
	my ($self) = @_;
	my $controller = $self->controller;
	my $duplicate_post = $self->mock_acls( { $controller->{user}->{id} => ['ad_sponsorship_unit_config_admin'] } );
	$controller->{cgi} = new CGI( { action => 'show_page', } );

	lives_ok( sub { $controller->auth_execute }, "show_page action OK" );
	isnt( $controller->{status}, 401, "Not 401 with correct acl permission" );
}

sub create_ad_sponsorship_unit_params : Tests {
	my ($self) = @_;
	my $controller = $self->controller;
	my $duplicate_post = $self->mock_acls( { $controller->{user}->{id} => ['ad_sponsorship_unit_config_admin'] } );
	my $missing_advertiser = { success => 0, message => 'Missing advertiser' };
	my $missing_config     = { success => 0, message => 'Missing config' };
	my $missing_start_at   = { success => 0, message => 'Missing start_at' };
	my $missing_end_at     = { success => 0, message => 'Missing end_at' };
	my $success = { output => { id => 1, success => 1 }, success => 1 };

	my $mock1  = Test::MockModule->new('buzzfeed2::Service::AdSponsorshipUnitConfig');
	my $called = {};

	$mock1->mock(
		'_add',
		sub {
			my ( $m, $a ) = @_;
			$called->{_add} = 1;
			return { id => 1 };
		}
	);

	$controller->{cgi} =
	  new CGI( { action => 'create_ad_sponsorship_unit', config => { gif_order => ["wtf","win","omg","lol","fail"] }, start_at => '2015-12-20 00:00:01', end_at => '2015-12-26 23:59:59', } );
	$controller->auth_execute;
	is_deeply( $controller->{json}, $missing_advertiser, "create_ad_sponsorship_unit fails with no advertiser" );

	$controller->{cgi} =
	  new CGI( { action => 'create_ad_sponsorship_unit', advertiser => 'geico', start_at => '2015-12-20 00:00:01', end_at => '2015-12-26 23:59:59', } );
	$controller->auth_execute;
	is_deeply( $controller->{json}, $missing_config, "create_ad_sponsorship_unit fails with no config param" );

	$controller->{cgi} =
	  new CGI( { action => 'create_ad_sponsorship_unit', advertiser => 'geico', config => { gif_order => ["wtf","win","omg","lol","fail"] }, end_at => '2015-12-26 23:59:59', } );
	$controller->auth_execute;
	is_deeply( $controller->{json}, $missing_start_at, "create_ad_sponsorship_unit fails with no start_at" );

	$controller->{cgi} =
	  new CGI(
		{ action => 'create_ad_sponsorship_unit', advertiser => 'geico', config => { gif_order => ["wtf","win","omg","lol","fail"] }, start_at => '2015-12-20 00:00:01', } );
	$controller->auth_execute;
	is_deeply( $controller->{json}, $missing_end_at, "create_ad_sponsorship_unit fails with no start_at" );


	$controller->{cgi} = new CGI({
		action         => 'create_ad_sponsorship_unit',
		advertiser     => 'geico',
		config         => { gif_order => ["wtf","win","omg","lol","fail"] },
		start_at       => '2015-12-20 00:00:01',
		end_at         => '2015-12-26 23:59:59',
		impression_url => 'impression',
		tracking_url   => 'click_tracking',
	});

	lives_ok( sub { $controller->auth_execute }, "create_ad_sponsorship_unit action OK with params" );
	is( $called->{_add},       1, "buzzfeed2::Service::AdSponsorshipUnitConfig->_add called." );
	is_deeply( $controller->{json}, $success, "create_ad_sponsorship_unit passes with all params" );
}

sub returns_401 : Test {
	my ( $self, $args ) = @_;

	my ( $resp, $controller, $html ) = BFTestUtil->request( { path => '/buzzfeed/ad_sponsorship_unit_config', raw_html => 1 } );
	is( $resp->{_rc}, 401, 'Got unauthorized response if not logged-in' );
	return;
}

1;
