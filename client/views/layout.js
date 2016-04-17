Template.layout.onCreated(function () {

});

Template.layout.onRendered(function () {
	
});

Template.layout.helpers({
  	
});

Template.layout.events({
	'click .mobile-button': function (event, template) {
		template.$('.mobile-button').toggleClass('open');
		template.$('.nav').toggleClass('open');
	}
});