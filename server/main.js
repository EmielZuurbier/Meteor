import { Meteor } from 'meteor/meteor';

Foursquare.init({
  id: 'CRBAOTGD450XTMVPAWES4Y4O3RWY2WKLQ0YOZPWBJYIXRNVU',
  secret: 'WVQFBBPTKMCURI0OLV30YZGAKLU4MS3BJRVRGOZIQNJMGX31',
  authOnly: false // need auth for using or no?
});


Meteor.startup(() => {
  	// code to run on server at startup
	
});

Meteor.publish('Leaderboard', function() {
	return Leaderboards.find({});
})

Meteor.publish('Markers', function () {
	return Markers.find({});
});

Meteor.publish('Races', function () {
	return Races.find({});
});

Meteor.publish("userStatus", function() {
  return Meteor.users.find({ "status.online": true });
});
