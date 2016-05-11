Router.configure({
	layoutTemplate: "layout"
});

//Router.onBeforeAction(function() {
//	if (! Meteor.userId()) {
//    	this.render('login');
//  	} else {
//    	this.next();
//  	}
//});

Router.route('/', function () {
	this.render('home');
});

Router.route('/login', function () {
	this.render('login');
});

Router.route('/register', function () {
	this.render('register');
});

Router.route('/create', function () {
	this.render('create');
});

Router.route('/race/:_id', function () {
	this.render('race', {
		data: function () {
			return Races.findOne({_id: this.params._id});
		}
	});
});