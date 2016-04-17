Template.register.events({
	'submit form': function(event) {
		var emailVar = event.target.registerEmail.value;
        var passwordVar = event.target.registerPassword.value;
		Accounts.createUser({
            email: emailVar,
            password: passwordVar
        });
		event.preventDefault();
		console.log("Form submitted.");
	}
});

Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;
		Meteor.loginWithPassword(emailVar, passwordVar);
        console.log("Form submitted.");
    }
});

Template.loggedIn.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
    }
});