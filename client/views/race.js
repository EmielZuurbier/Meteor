var player,
	markersFind = Markers.find().fetch();

var redIcon = L.icon({
    iconUrl: '/icons/marker-icon-red-2x.png',
    shadowUrl: '/icons/marker-shadow.png',

    iconSize:     [25, 41], // size of the icon
    shadowSize:   [41, 41], // size of the shadow
    iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
    shadowAnchor: [12, 41],  // the same for the shadow
    popupAnchor:  [1, -34] // point from which the popup should open relative to the iconAnchor
});

var breadcrum = L.icon({
	iconUrl: '/icons/breadcrum.png',
	iconSize: 	[10, 10],
	iconAnchor:	[5, 5 ]
})

var playerIcon = L.divIcon({
	iconSize: [26, 26],
	iconAnchor: [13, 13],
	className: 'player-icon'
});

Template.race.onCreated(function () {
	Meteor.subscribe('Markers');
	Meteor.subscribe('Races');
	Meteor.subscribe('users');
	
	// Get location
	navigator.geolocation.getCurrentPosition(function (data) {
		lat = data['coords']['latitude'];
 		lng = data['coords']['longitude'];
	});
	
	Meteor.users.update({_id: Meteor.user()._id}, {$set: {lat: lat}, $set:{lng: lng}});
});

Template.race.onRendered(function () {
	
	var latLngArray = [L.latLng(lat, lng)];
	
	// Create the map
	var mapContainer = $('.map');
	map = L.map(mapContainer[0], {
		doubleClickZoom: false,
		touchZoom: true,
	}).setView([lat, lng], 11);

	// Set default icon
	L.Icon.Default.imagePath = '/icons';

	// Set the map style
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'MiloSaurus',
		id: 'milosaurus.plpodn6j',
		accessToken: 'pk.eyJ1IjoibWlsb3NhdXJ1cyIsImEiOiJjaWc5N3I4bnAwOWJvdGFsdDIxZDZkYnE4In0.Ke7TOrRQQU0eBVRuv9YvZQ'
	}).addTo(map);

	// Add markers from race database
	for (var i = 0; i < markersFind.length; i += 1) {
		console.log(markersFind);
		marker = new L.marker(L.latLng(markersFind[i].lat, markersFind[i].lng), {
			clickable: true,
			title: markersFind[i].title,
			address: markersFind[i].address,
			city: markersFind[i].city,
		}).addTo(map);
	}
	
	var polyline = L.polyline(latLngArray, {
		color: 'red'
	}).addTo(map);
	
	// Add player marker
	player = new L.marker(L.latLng(lat, lng), {
		clickable: true,
		icon: playerIcon
	}).on('click', function (layer) {
		layer.bindPopup("<h1>" + Meteor.userId() + "</h1");
	}).addTo(map);

	navigator.geolocation.watchPosition(function (data) {
		lat = data['coords']['latitude'];
 		lng = data['coords']['longitude'];
		var newLatLng = L.latLng(lat, lng);
		player.setLatLng(newLatLng);
		polyline.addLatLng(newLatLng);
	});

});