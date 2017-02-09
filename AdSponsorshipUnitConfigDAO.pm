package buzzfeed2::model::AdSponsorshipUnitConfigDAO;

=head1 NAME

buzzfeed2::model::AdSponsorshipUnitConfigDAO

Description: Method for adding and getting data from ad_sponsorship_unit DB table.

=head2 METHODS

=cut

use strict;
use warnings;

# external modules
use DBI;
use Error qw( :try );

# local modules
use buzzfeed2::Config;
use buzzfeed2::error::BadArgument;

use base qw( buzzfeed2::model::BFModel );

use constant TABLE_NAME => 'ad_sponsorship_unit';

use constant FIELDS => {
	id             => { numeric => 1, required => 0 },
	user_id        => { numeric => 1, required => 1 },
	config         => { numeric => 0, required => 1 },
	start_at       => { numeric => 0, required => 1 },
	end_at         => { numeric => 0, required => 1 },
	impression_url => { numeric => 0, required => 0 },
	tracking_url   => { numeric => 0, required => 0 },
};

=head3 _add_ad_sponsorship_unit_config_entry_from_hash

Description: Checks if ad_sponsorship_unit_hash was passed from service and saves campaign in DB

Parameters: None

Returns: { id : 201 }

=cut

sub _add_ad_sponsorship_unit_config_entry_from_hash() {
	my ( $self, $args ) = @_;
	throw buzzfeed2::error::BadArgument('Needs a ad_sponsorship_unit config hash') unless ( 
		my $hash = $args->{ad_sponsorship_unit_config_hash} 
	);

	my $campaign_id = $args->{campaign_id_hash};
	#remove edited campaign 
	if( $campaign_id ) {
		$self->remove({ id => $campaign_id });
	}

	my $campaign  = $self->new($hash);
	my $id = $campaign->save();

	return $id;
};

=head4 get_all_ad_sponsorship_unit_configs

Description: Gets all React with 5 GIFs campaigns from DB table

Parameters: None

Returns: formated_output => [{
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

=cut

sub get_all_ad_sponsorship_unit_configs {
	my ( $self ) = @_;
	my $campaigns = $self->_get_all_ad_sponsorship_unit_config_data();
	my @formated_output = ();

	for my $ad_sponsorship_unit (@$campaigns) {
		push @formated_output, {
			id             => $ad_sponsorship_unit->[0],
			user_id        => $ad_sponsorship_unit->[1],
			config         => $ad_sponsorship_unit->[2],
			start_at       => $ad_sponsorship_unit->[3],
			end_at         => $ad_sponsorship_unit->[4],
			impression_url => $ad_sponsorship_unit->[5],
			tracking_url   => $ad_sponsorship_unit->[6]
		};
	}

	return \@formated_output;
};

=head5 _get_all_ad_sponsorship_unit_config_data

Description: Creates select query for getting all React with 5 GIFs campaigns from DB table

Parameters: None

Returns: campaigns => [{
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

=cut

sub _get_all_ad_sponsorship_unit_config_data() {
	my ( $self, $args ) = @_;

	my $dbh = buzzfeed2::model::BFDB->connect;
	my $sql = 'SELECT * FROM ' . TABLE_NAME;
	my $sth = $dbh->prepare($sql);
	$sth->execute;

	my $campaigns = $sth->fetchall_arrayref();
	$sth->finish;
	return $campaigns;
};

=head6 get_active_ad_sponsorship_unit_configs

Description: Returns all React w/a GIF campaigns that are currently running + two weeks ahead of the current date from ad_sponsorship_unit DB table.

Parameters: None

Returns: formated_output => [{
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

=cut

sub get_active_ad_sponsorship_unit_configs {
	my ( $self ) = @_;
	my $campaigns = $self->_get_active_ad_sponsorship_unit_config_data();
	my @formated_output = ();

	for my $ad_sponsorship_unit (@$campaigns) {
		push @formated_output, {
			id             => $ad_sponsorship_unit->[0],
			user_id        => $ad_sponsorship_unit->[1],
			config         => $ad_sponsorship_unit->[2],
			start_at       => $ad_sponsorship_unit->[3],
			end_at         => $ad_sponsorship_unit->[4],
			impression_url => $ad_sponsorship_unit->[5],
			tracking_url   => $ad_sponsorship_unit->[6]
		};
	}

	return \@formated_output;
};

=head7 _get_active_ad_sponsorship_unit_config_data

Description: campaigns last for a week, from Monday to Sunday and we are selecting campaigns that are currently running on the system and the campaign that are scheduled to run in next 2 weeks from ad_sponsorship_unit DB table.

Parameters: None

Returns: campaigns => [{
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

=cut

sub _get_active_ad_sponsorship_unit_config_data() {
	my ( $self, $args ) = @_;

	my $dbh = buzzfeed2::model::BFDB->connect;
	my $sql = 'SELECT * FROM ' . TABLE_NAME . ' USE KEY (idx_start_at_end_at) WHERE start_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND start_at <= DATE_ADD(NOW(), INTERVAL 14 DAY)';
	my $sth = $dbh->prepare($sql);
	$sth->execute;

	my $campaigns = $sth->fetchall_arrayref();
	$sth->finish;
	return $campaigns;
};

1;
