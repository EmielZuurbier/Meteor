import { Meteor } from 'meteor/meteor';

// Foursquare credentials
Foursquare.init({
  id: 'CRBAOTGD450XTMVPAWES4Y4O3RWY2WKLQ0YOZPWBJYIXRNVU',
  secret: 'WVQFBBPTKMCURI0OLV30YZGAKLU4MS3BJRVRGOZIQNJMGX31',
  authOnly: false // need auth for using or no?
});

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.publish('races', function () {
	return Races.find();
});
