
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/html/debug.html');
});
app.get('/game', function(req, res){
	res.sendFile(__dirname + '/client/html/game.html');
});
app.use( express.static('client'));
http.listen(3000, '0.0.0',function(){
    console.log('listening on *:3000');
});

const Game = require('./server/Models/Game.js');
let currentGame = new Game();
currentGame.io = io;
io.on('connection', function(socket) {
	currentGame.newPlayer(socket);
	socket.on('debug',function (msg) {
		console.log('debug msg - '+msg);
	});
	socket.on('disconnect',function (reason) {
		currentGame.playerLeave(socket);
	});
	socket.on('draft archetype',function (archetypeID) {
		currentGame.playerDraftsArchetype(socket.id,archetypeID);
	});
	socket.on('draft title',function (titleID) {
		currentGame.playerDraftsTitle(socket.id,titleID);
	});
	socket.on('draft ability',function (abilityID) {
		currentGame.playerDraftsAbility(socket.id,abilityID);
	});
	socket.on('draft bench ability',function (abilityID) {
		currentGame.playerDraftsBenchAbility(socket.id,abilityID);
	});
	socket.on('next draft',function () {
		currentGame.playerRequestsNextDraft(socket.id);
	});
});

