
Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var userVar = event.target.username.value;
        var passwordVar = event.target.password.value;
        Meteor.loginWithPassword(userVar, passwordVar, function (error) {
			if (Meteor.user()) {
                Router.go('/');
			} else {
				var message = "There was an error logging in: <strong>" + error.reason + "</strong>";
			}
		});
    },
	'click .logout': function () {
		Meteor.logout();
	}
});

Template.login.helpers({
	User () {
		var user = Meteor.users.findOne({_id: Meteor.userId()});
		return user.username;
	}
})

Template.register.events({
	'submit form': function(event) {
        event.preventDefault();
		var userVar = event.target.username.value;
        var emailVar = event.target.email.value;
        var passwordVar = event.target.password.value;
        Accounts.createUser({
            email: emailVar,
			username: userVar,
            password: passwordVar
        });
		Meteor.loginWithPassword(userVar, passwordVar, function (error) {
			if (Meteor.user()) {
                Router.go('/');
			} else {
				var message = "There was an error logging in: <strong>" + error.reason + "</strong>";
			}
		});
    }
})