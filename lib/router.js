Router.configure({
    layoutTemplate: 'layout'
});

Router.route('/', {
	template: 'home'
});

Router.route('/account', {
	template: 'account'
});

Router.route('/map', {
	template: 'map'
});

Router.route('/map/:id', {
	template: 'map',
	data: function () {
		return Races.findOne({_id: this.params._id});
	}
});

Router.route('/overview', {
	template: 'overview'
});

Router.route('/leaderboard', {
	template: 'leaderboard'
});

Router.route('/race/:id', {
	template: 'race',
	data: function(){
        console.log(this.params.id)
	}
});