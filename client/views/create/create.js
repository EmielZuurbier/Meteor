Template.create.onCreated(function () {
	
	// Create array to store selected markers
	if (!Session.get('selected')) {
		selectedArray = [];
	} else {
		selectedArray = Session.get('selected');
	}
	
	// Get locationmarkers from Foursquare
	get();
	
});

Template.create.onDestroyed(function () {
	
	// Clear markers from map
	locationMarkers.clearLayers();
	map.removeLayer(locationMarkers);
	
});

Template.create.helpers({
	
	Locations () {
		return Session.get('selected');
	},
	Length () {
		var session = Session.get('selected');
		return session.length;
	}
	
});

Template.create.events({
	
	'click .create': function (e, template) {
		var name = $('#title');
		var session = Session.get('selected');
		
		console.log(name[0].value, session);
		
		if (name[0].value === '') {
			
			// If no name has been given
			alert('Please name the race');
			
		} else if (session === [] || session === undefined) {
			
			// If no locations are selected
			alert('Please add locations');
			
		} else {
			
			// Add race to database
			Meteor.call('createRace', name[0].value, session);
			
			// Clear Session
			delete Session.keys['selected'];
			
			// Go back to home
			Router.go('/');
		}
	},
	
	'click .delete': function (e, template) {
		
		// Cache this
		var self = this;
		
		// Return the array without the filtered marker
		selectedArray = selectedArray.filter(function(el) { 
			return el.id !== self.id; 
		});

		// Set the new session value
		Session.set('selected', selectedArray);
	},
	
	'click #menu': function (e, template) {
		
		template.$('.bottom-menu').toggleClass('open');
		template.$('#menu').toggleClass('open');
		
	},
	
	'click .refresh': function (e, template) {
		
		// Clear locationmarkers
		locationMarkers.clearLayers();
		
		// Get locationmarkers from Foursquare
		get();
		
	},
	
	'click .back': function () {
		
		Router.go('/');
		
	}
	
});

function get() {
	
	// Save location in object
	var coords = {};
	
	// Start loader
	$('#loader').addClass('active');
	
	// Get current location
	navigator.geolocation.getCurrentPosition(function (data) {
		
		coords.lat = data.coords.latitude;
 		coords.lng = data.coords.longitude;
		
		// Set params for Foursquare
		var params = {
			ll: coords.lat + ',' + coords.lng,
			query: 'bar',
		};
		
		// Get locations from Foursquare
		Foursquare.find(params, function(error, result) {
			if (!error) {
				data = result.response.venues;
				
				// Add location markers to map
				for (var i = 0; i < data.length; i += 1) {
					var marker = new L.marker(L.latLng(data[i].location.lat, data[i].location.lng), {
						clickable: true,
						id: i,
						title: data[i].name,
						address: data[i].location.address,
						city: data[i].location.city,
						postalCode: data[i].location.postalCode,
						icon: markerIcon,
						added: false
					}).on('click', function (e) {
						
						// Store this
						var self = this;
						
						if (this.options.added === false) {
							
							// Push marker to array
							selectedArray.push({
								id: this.options.id,
								title: this.options.title,
								address: this.options.address,
								city: this.options.city,
								postalCode: this.options.postalCode,
								lat: this._latlng.lat,
								lng: this._latlng.lng,
								captured: false,
								capturedBy: []
							});
							
							// Set added to true
							this.options.added = true;
							
							// Change the icon to selected
							$(this._icon).toggleClass('selected');
							
							console.log(this.options.title + " has been added");
							
						} else {
							
							// Remove selected marker from array
							selectedArray = selectedArray.filter(function(el) { 
								return el.id !== self.options.id; 
							});
							
							// Set added to false
							this.options.added = false;
							
							// Change the icon to selected
							$(this._icon).toggleClass('selected');
							
							console.log(this.options.title + " has been removed");
							
						}
						
						// Store array in session
						Session.set('selected', selectedArray);
					});
					
					// Add markers to featuregroup
					locationMarkers.addLayer(marker);
				}
				
				// Add layer to map
				map.addLayer(locationMarkers);
				
				// Finish loader
				$('#loader').removeClass('active');
				
			} else {
				
				// If no data has been received.
				alert("Could not get data from Foursquare, please try again later");
				
			}
		});
	});
}