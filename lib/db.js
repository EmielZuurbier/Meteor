// User database
//Users = new Mongo.Collection('users');

RacesTemp = new Mongo.Collection('racetemp');

// Races database
Races = new Mongo.Collection('races');

//Races.insert({
//	title: title,
//	players: [{
//		
//	}],
//	markers: [{
//		
//	}]
//})

// Selected points
Markers = new Mongo.Collection('markers', {limit: 5});

// Leaderboards
Leaderboards = new Mongo.Collection('leaderboards');

//Users.insert({
//	name: 'Emiel',
//	mail: 'emielzuurbier@outlook.com',
//	password: 'A38jb#kl@'
//});