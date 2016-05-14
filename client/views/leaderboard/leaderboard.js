Template.leaderboard.onCreated(function () {
	
	// Subscribe to leaderboards
	Meteor.subscribe('leaderboards');
	
});

Template.leaderboard.helpers({
	
	Leaderboard () {
		return Leaderboards.find().fetch();
	}
	
})