Template.overview.onCreated(function () {
	Meteor.subscribe('Races');
	Meteor.subscribe('Markers');
});

Template.overview.helpers({
	Races () {
		return Markers.find({});
	}
});