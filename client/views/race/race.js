// Get current hash id
function pageId() {
	var parts = location.href.split('/');
	return parts.pop();
}

Template.race.onCreated(function () {
	
	// Subscribe to the races database
	Meteor.subscribe('races');
	
});

Template.race.onRendered(function () {
	
	// Zoom in on current laction
	map.setView([coords.lat, coords.lng], 15);
	
	// Get current hash id
	var parts = location.href.split('/');
	var id = parts.pop();
	
	// Track the location and update to database
	navigator.geolocation.watchPosition(function (data) {
		coords.lat = data.coords.latitude;
 		coords.lng = data.coords.longitude;
		
		var newLatLng = L.latLng(coords.lat, coords.lng);
		
		Meteor.call('updateCoords', id, coords);
		Meteor.call('updatePath', id, newLatLng);
	});
	
	// Add player to the race
	Meteor.call('addPlayer', id, coords);
	
	// Cache userId
	var userId = Meteor.userId()
	
	// Cache the current race, players and locations
	var currentRace = Races.findOne({_id: id});
	var players = currentRace.players;
	var locations = currentRace.locations;
	
	// Set user marker on map
	if (locations !== [] || typeof(locations) !== undefined) {
		
		locations.forEach(function (location) {
			
			// Check if location has been captured
			if (location.captured === true) {
				
				var marker = new L.marker(L.latLng(location.lat, location.lng), {
					clickable: true,
					id: location.id,
					title: location.title,
					address: location.address,
					city: location.city,
					postalCode: location.postalCode,
					icon: markerIconCaptured
				}).bindPopup('<h3>' + location.title + '</h3><p>' + location.address + '</p><p>Captured by: ' + location.capturedBy + '</p>');

				// Add markers to layer
				raceMarkers.addLayer(marker);
				
			} else {
				
				var marker = new L.marker(L.latLng(location.lat, location.lng), {
					clickable: true,
					id: location.id,
					title: location.title,
					address: location.address,
					city: location.city,
					postalCode: location.postalCode,
					icon: markerIcon
				}).bindPopup('<h3>' + location.title + '</h3><p>' + location.address + '</p>');

				// Add markers to layer
				raceMarkers.addLayer(marker);
				
			}
			
		});
		
	}
	
	// Add layer to map
	map.addLayer(playerMarkers);
	map.addLayer(raceMarkers);
	map.addLayer(polylinesGroup);
	
	// Check if changes are made to database
	Races.find({_id: id}).observeChanges({
		
		// DIT HEB IK NET TOEGEVOEGD
//		changed: function (id, fields) {
//			
//			var markers = playerMarkers.getLayers();
//			for (var i = 0; i < fields.players.length; i += 1) {
//				markers[i].setLatLng(L.latLng(fields.players[i].lat, fields.players[i].lng));
//			}
//			
//		},
		changed: function (id, fields) {
						
			// Clear all the icons first
			playerMarkers.clearLayers();
			polylinesGroup.clearLayers();
			
			// Add all the icons
			fields.players.forEach(function (player) {
				
				if (player.id !== userId) {
					
					// Add icons of the opponents
					var marker = new L.marker(L.latLng(player.lat, player.lng), {
						clickable: true,
						id: player.id,
						name: player.name,
						lat: player.lat,
						lng: player.lng,
						icon: playerIcon
					}).bindPopup('<h3>' + player.name + '</h3>');
					
					// Add tailline for opponents
					var polyline = L.polyline(player.path, {
						color: "#57e57d",
						opacity: 1
					});
					
					// Get last location
					var curLoc = new L.latLng(player.lat, player.lng);
					
					// Check how far the opponents are from locations
					locations.forEach(function (location) {
//						console.log(curLoc.distanceTo(L.latLng(location.lat, location.lng)));
					});

					// Add markers to layer
					playerMarkers.addLayer(marker);
					polylinesGroup.addLayer(polyline);
					
				} else {
				
					// Add icon of user
					var marker = new L.marker(L.latLng(player.lat, player.lng), {
						clickable: true,
						id: player.id,
						name: player.name,
						lat: player.lat,
						lng: player.lng,
						icon: userIcon
					}).bindPopup('<h3>' + player.name + '</h3>');
					
					// Add tailline latLng
					var polyline = L.polyline(player.path, {
						color: '#e55773',
						opacity: 1
					});
					
					// Get last location
					var curLoc = new L.latLng(player.lat, player.lng);
					
					// Check how far the player is from the locations
					locations.forEach(function (location) {
						var destination = L.latLng(location.lat, location.lng);
						if (curLoc.distanceTo(destination) < 30) {
//							console.log("You are in range");
							console.log(id, player, location);
							console.log(raceMarkers.getLayers());
//							Meteor.call('captureMarker', id, player, location);
						}
					});

					// Add markers to layer
					playerMarkers.addLayer(marker);
					polylinesGroup.addLayer(polyline);
				}
				
			});
			
		}
	});
	
});


Template.race.onDestroyed(function () {
	
	// Get current hash id
	var parts = location.href.split('/');
	var id = parts.pop();
	
	// Remove layers
	playerMarkers.clearLayers();
	raceMarkers.clearLayers();
	polylinesGroup.clearLayers();
	map.removeLayer(playerMarkers);
	map.removeLayer(raceMarkers);
	map.removeLayer(polylinesGroup);
	
});


Template.race.events({
	
	'click #center': function (e) {
		
		// Zoom in on current laction
		map.setView([coords.lat, coords.lng], 15);
		
	},
	
	'click #leave': function (e) {
		
		// Get current hash id
		var parts = location.href.split('/');
		var id = parts.pop();
		
		// Remove player from race
		Meteor.call('removePlayer', id);
		
		// Go to home
		Router.go('/');
		
	},
	
	'click #menu': function (e, template) {	
		
		// Open menu
		template.$('.bottom-menu').toggleClass('open');
		template.$('#menu').toggleClass('open');
		
	},
	
	'click .race': function (e) {
		
		// Navigate to location marker
		map.setView([this.lat, this.lng], 15);
		e.preventDefault();
		
	}
})

//	Races.insert({name: "Multiplayer", active: true, players: [{name: "Emiel", id: Meteor.userId(), lat: "52.36469574390987", lng: "4.897831678390503"}, {name: "Sera", id: "5893jjfdk2ke0", lat: "52.36836436656389", lng: "4.88641619682312"}], locations: []})