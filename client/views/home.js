Template.home.onCreated(function () {
	Meteor.subscribe('Races');
});

Template.home.helpers({
	Races () {
		return Races.find({});
	},
	Players () {
		return Races.find({}, {fields: 'players'});
	}
});

Template.home.events({
	"click .done": function (e, template) {
		e.preventDefault();
		var input = template.$('input[type="text"]');
		Races.insert({
			title: input[0].value,
			players: [],
			markers: []
		});
		input[0].value = '';
		var nextRoute = Races.findOne();
		var nextId = nextRoute._id;
		Router.go('/map/' + nextId, {_id: nextId});
	},
	"click .delete": function (e) {
		Races.remove(this._id);
	}
})