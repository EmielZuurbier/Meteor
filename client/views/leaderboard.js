Template.leaderboard.onCreated(function () {
	Meteor.subscribe('Leaderboards');
})

Template.leaderboard.helpers({
	Leaderboards () {
		return Leaderboards.find({});
	}
})