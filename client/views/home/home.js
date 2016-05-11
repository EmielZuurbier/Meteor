
Template.home.onCreated(function () {
	Meteor.subscribe('races');
});

Template.home.onRendered(function () {
	if (typeof(map) !== undefined && typeof(coords) !== undefined) {
//		map.setView([coords.lat, coords.lng], 13);
	}
});

Template.home.helpers({
	Races () {
		return Races.find().fetch();
	},
	Players () {
		return this.players.length;
	},
	Locations () {
		return this.locations.length;
	},
	Remove () {
		return this.createdBy === Meteor.userId();
	},
	RaceNumber () {
		return Races.find().fetch().length > 0;
	}
});

Template.home.events({
	'click .remove': function (e) {
		// Add player to race
		Meteor.call('removeRace', this._id);
	}
});