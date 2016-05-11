Meteor.methods({
	'createRace': function (name, session) {
		Races.insert({
			name: name, 
			players: [], 
			locations: session,
			active: false,
			createdBy: Meteor.userId()
		});
	},
	'removeRace': function (id) {
		Races.remove({_id: id});
	},
	'updateCoords': function (id, coords) {
		Races.update({
			_id: id, 
			'players.id': Meteor.userId()
		}, 
	 	{
			$set: {
				'players.$.lat': parseFloat(coords.lat), 
				'players.$.lng': parseFloat(coords.lng)
			}
		});
	},
	'updatePath': function (id, latlng) {
		Races.update({
			_id: id, 
			'players.id': Meteor.userId()
		}, 
	 	{
			$push: {
				'players.$.path': latlng, 
			}
		});
	},
	'captureMarker': function (id, player, location) {
		var currentRace = Races.findOne({_id: id});
		if (!_.some(currentRace.locations, function (loc) {
			return loc.capturedBy === player.name;
		})) {
			Races.update({
				_id: id,
				'locations.id': location.id
			},
			{
				$push: {
					'locations.$.capturedBy': player.name
				},
				$set: {
					'locations.$.captured': true
				}
			});
		}
	},
	'addPlayer': function (id, coords) {
		var user = Meteor.users.findOne({_id: Meteor.userId()});
		var currentRace = Races.findOne({_id: id});
		
		if (!_.some(currentRace.players, function (player) {
			return player.id === Meteor.userId();
		})) {
			Races.update({
				_id: id
			}, 
			{
				$push: {
					players: {
						name: user.username,
						id: user._id,
						lat: coords.lat,
						lng: coords.lng,
						path: [],
						capturedLocations: [],
						capturedNumber: ""
					}
				}
			});	
		}
	},
	'removePlayer': function (id) {
		Races.update({
			_id: id
		},
		{
			$pull: {
				players: {
					id: Meteor.userId()
				}
			}
		});
	}
});