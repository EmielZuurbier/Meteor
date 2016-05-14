
Template.home.onCreated(function () {
	
	// Subscribe to the races database
	Meteor.subscribe('races');
	
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