package t::model::AdSponsorshipUnitConfigDAOTest;

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

use Data::Dump qw(dump);

# local modules
use BFTestUtil;
use buzzfeed2::fixture::Builder;
use buzzfeed2::fixture::Null;

# what we're testing
sub test_module { 'buzzfeed2::model::AdSponsorshipUnitConfigDAO' }

#
# startup/shutdown
#

sub startup : Test(startup => +1) {
	my ($self) = @_;

	# run parent's startup first
	$self->SUPER::startup;
	use_ok(test_module);
	$self->{dbh} = buzzfeed2::model::BFDB->connect();
	return;
}

#
# setup/teardown
#

sub setup : Test(setup) {
	my ($self) = @_;

	# run parent's setup first
	$self->SUPER::setup;
	$self->{session} = BFTestUtil->create_session();
	return;
}

sub teardown : Test(teardown) {
	my ($self) = @_;
	BFTestUtil->destroy_session;
	$self->{session} = undef;

	# run parent's teardown last
	$self->SUPER::teardown;
	return;
}

#
# tests
#

sub isa_bfdb_model : Test {
	my ($self) = @_;
	my $obj = bless {}, test_module;
	isa_ok( $obj, 'buzzfeed2::model::BFDB' );
	return;
}

sub add_ad_sponsorship_unit_config_entry_from_hash : Tests {
	my ($self) = @_;

	my $needs_hash = qr/hash/;

	my $ad_sponsorship_unit_hash = {
		user_id        => 212423,
		config         => { gif_order => ["wtf","win","omg","lol","fail"] },
		start_at       => '2015-12-20 00:00:01',
		end_at         => '2015-12-26 23:59:59',
		impression_url => 'impression',
		tracking_url   => 'click_tracking',
	};

	throws_ok(
		sub {
			test_module->_add_ad_sponsorship_unit_config_entry_from_hash( );
		},
		$needs_hash,
		"_add_ad_sponsorship_unit_config_entry_from_hash throws error if no ad_sponsorship_unit hash."
	);

	lives_ok(
		sub { test_module->_add_ad_sponsorship_unit_config_entry_from_hash( { ad_sponsorship_unit_config_hash => $ad_sponsorship_unit_hash } ) }
		,
		'_add_ad_sponsorship_unit_config_entry_from_hash lives w params'
	);

	my $sth = $self->{dbh}->prepare('SELECT * FROM ad_sponsorship_unit');
	$sth->execute();
	my $record = $sth->fetchrow_hashref;

	is( $record->{user_id},        $ad_sponsorship_unit_hash->{user_id},        'Correct user_id' );
	is( $record->{config},         $ad_sponsorship_unit_hash->{config},         'Correct config' );
	is( $record->{start_at},       $ad_sponsorship_unit_hash->{start_at},       'Correct start_at' );
	is( $record->{end_at},         $ad_sponsorship_unit_hash->{end_at},         'Correct end_at' );
	is( $record->{impression_url}, $ad_sponsorship_unit_hash->{impression_url}, 'Correct impression_url' );
	is( $record->{tracking_url},   $ad_sponsorship_unit_hash->{tracking_url},   'Correct tracking_url' );
	my $old_user_id = $record->{user_id};

	$ad_sponsorship_unit_hash->{user_id} = 212425;
	lives_ok(
		sub { test_module->_add_ad_sponsorship_unit_config_entry_from_hash( { ad_sponsorship_unit_config_hash => $ad_sponsorship_unit_hash } ) }
		,
		'_add_ad_sponsorship_unit_config_entry_from_hash lives w params'
	);

	$sth = $self->{dbh}->prepare('SELECT * FROM ad_sponsorship_unit');
	$sth->execute();
	$record = $sth->fetchrow_hashref;

	is( $record->{user_id},        $ad_sponsorship_unit_hash->{user_id},        'Correct user_id' );
	isnt($record->{user_id},       $old_user_id,                               'Recorder new user_id');
	is( $record->{config},         $ad_sponsorship_unit_hash->{config},         'Correct config' );
	is( $record->{start_at},       $ad_sponsorship_unit_hash->{start_at},       'Correct start_at' );
	is( $record->{end_at},         $ad_sponsorship_unit_hash->{end_at},         'Correct end_at' );
	is( $record->{impression_url}, $ad_sponsorship_unit_hash->{impression_url}, 'Correct impression_url' );
	is( $record->{tracking_url},   $ad_sponsorship_unit_hash->{tracking_url},   'Correct tracking_url' );

	$sth = $self->{dbh}->do('DELETE FROM ad_sponsorship_unit');
}

1;
