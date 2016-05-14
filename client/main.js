import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

// Store coordinates in object
var coords = {}

Template.layout.onCreated(function () {
	
	// Subcribe to Races
	Meteor.subscribe('races');
	
});

Template.layout.onRendered(function () {
	
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

		// Create user icon
		userIcon = L.divIcon({
			iconSize: [20, 20],
			iconAnchor: [10, 10],
			className: 'user-marker'
		});

		// Create player icon
		playerIcon = L.divIcon({
			iconSize: [20, 20],
			iconAnchor: [10, 10],
			className: 'player-marker'
		});

		// Create location marker
		markerIcon = L.divIcon({
			iconSize: [20, 20],
			iconAnchor: [10, 10],
			className: 'location-marker'
		});
		
		// Create captured location marker
		markerIconCaptured = L.divIcon({
			iconSize: [20, 20],
			iconAnchor: [10, 10],
			className: 'location-marker captured'
		});

		// Create featuregroup for the Foursquare locations
		locationMarkers = new L.LayerGroup();

		// Create featuregroup for all players in race
		playerMarkers = new L.LayerGroup();

		// Create featuregroup for all race locations
		raceMarkers = new L.LayerGroup();

		// Create featuregroup for polylines
		polylinesGroup = new L.FeatureGroup();

		// Create the map
		var mapContainer = document.getElementById('map');
		map = L.map(mapContainer, {
			doubleClickZoom: true,
			touchZoom: true,
			zoomControl: false,
			inertia: true
		}).setView([coords.lat, coords.lng], 13);

		// Set default icon
		L.Icon.Default.imagePath = './icons';

		// Set the map style
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			attribution: 'Rat Race',
			id: 'milosaurus.00bmb0k2',
			accessToken: 'pk.eyJ1IjoibWlsb3NhdXJ1cyIsImEiOiJjaWc5N3I4bnAwOWJvdGFsdDIxZDZkYnE4In0.Ke7TOrRQQU0eBVRuv9YvZQ'
		}).addTo(map);
		
		// Finish loader
		$('#loader').removeClass('active');
	});
	
});