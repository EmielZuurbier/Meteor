var data,
	lat,
	lng,
	params,
	open = false;

var parts = location.href.split('/');
var id = parts.pop();

var redIcon = L.icon({
    iconUrl: '/icons/marker-icon-red-2x.png',
    shadowUrl: '/icons/marker-shadow.png',

    iconSize:     [25, 41], // size of the icon
    shadowSize:   [41, 41], // size of the shadow
    iconAnchor:   [12, 41], // point of the icon which will correspond to marker's location
    shadowAnchor: [12, 41],  // the same for the shadow
    popupAnchor:  [1, -34] // point from which the popup should open relative to the iconAnchor
});

Template.map.onCreated(function () {
	Meteor.subscribe('Markers');
	Meteor.subscribe('Races');
});

Template.map.onRendered(function () {
	
	// Get location
	navigator.geolocation.getCurrentPosition(function (data) { 
		lat = data['coords']['latitude'];
 		lng = data['coords']['longitude'];
		params = {
			ll: lat + ',' + lng,
			query: 'bar',
		};

		// Create the map
		var mapContainer = $('.map');
		map = L.map(mapContainer[0], {
			doubleClickZoom: false,
			touchZoom: true,
		}).setView([lat, lng], 13);

		// Set default icon
		L.Icon.Default.imagePath = './icons';

		// Set the map style
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			attribution: 'MiloSaurus',
			id: 'milosaurus.plpodn6j',
			accessToken: 'pk.eyJ1IjoibWlsb3NhdXJ1cyIsImEiOiJjaWc5N3I4bnAwOWJvdGFsdDIxZDZkYnE4In0.Ke7TOrRQQU0eBVRuv9YvZQ'
		}).addTo(map);

		// Get the Foursquare data
		Foursquare.find(params, function(error, result) {
			if (!error) {
				data = result.response.venues;
				addMarkers(data);
			}
		});
	});
});

Template.map.helpers({
	Races () {
		return Races.find({_id: id}, {'markers':1});
	},
	Markers () {
		return Markers.find({});
	}
});

Template.map.events({
	'click .delete-marker': function (e) {
		Races.remove(this._id);
	},
	'click .more': function (e, template) {
		if (open === true) {
			template.$('.list').text('See Markers');
			open = false;
		} else {
			template.$('.list').text('Hide Markers');
			open = true;
		}
		template.$('.map-info').toggleClass('open');
	},
	'click .leaflet-marker-icon': function(e, template) {
		template.$(e.target.currentTa).toggleClass('selected');
	}
});

// Add markers to map
function addMarkers (data) {
	for (var i = 0; i < data.length; i += 1 ) {
		marker = new L.marker(L.latLng(data[i].location.lat, data[i].location.lng), {
			clickable: true,
			title: data[i].name,
			address: data[i].location.address,
			city: data[i].location.city,
			postalCode: data[i].location.postalCode,
			icon: redIcon
		}).on('click', function (e) {
			Races.update({_id: id}, {
				$push: { markers: {
					title: e.target.options.title,
					address: e.target.options.address,
					city: e.target.options.city,
					lat: e.latlng.lat,
					lng: e.latlng.lng
				}}
			});
			Markers.insert({
				title: e.target.options.title,
				address: e.target.options.address,
				city: e.target.options.city,
				lat: e.latlng.lat,
				lng: e.latlng.lng
			});
		}).addTo(map);
	}
}

//.bindPopup('<h3>' + data[i].name + '</h3>' + '<p>' + data[i].location.address + '</p>' + '<button class="add button done no-float">Add Location</button>')