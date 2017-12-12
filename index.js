
"use strict";
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	console.log('New page load');
    res.sendFile(__dirname + '/client/index.html');
});
app.use( express.static('client'));
http.listen(3000, '0.0.0',function(){
    console.log('listening on *:3000');
});

const Player = require('./server/Models/Player.js');
const Game = require('./server/Models/Game.js');
let currentGame = new Game();
io.on('connection', function(socket) {
    socket.on('getGameUpdate', function () {
        socket.emit('update',currentGame.toJSON());
    });
    socket.on('logIn', function (userName) {
    	if(currentGame.currentState === 'endGame') {
    		currentGame = new Game();
	    }
        currentGame.playerJoin(new Player({socketID:socket.id, name:userName}));
        updatePlayers();
    });
    socket.on('selectCard',function (cardID) {
	    try {
		    currentGame.selectCard(socket.id,cardID);
		    updatePlayers();
	    } catch(err) {
		    updatePlayersOnError(err);
	    }
    });
	socket.on('confirmCard', function (cardID) {
		try {
			currentGame.confirmCard(socket.id,cardID);
			updatePlayers();
		} catch(err) {
			updatePlayersOnError(err);
		}
	});
	socket.on('selectAttack', function (attackID) {
		try {
			currentGame.selectAttack(socket.id, attackID);
			updatePlayers();
		} catch(err) {
			updatePlayersOnError(err);
		}
	});
	socket.on('processDuel', function () {
		try {
			currentGame.processDuel();
			updatePlayers();
		} catch(err) {
			updatePlayersOnError(err);
		}
	});
	socket.on('acceptResults', function () {
		try {
			currentGame.continueGame();
			updatePlayers();
		} catch(err) {
			updatePlayersOnError(err);
		}
	});
	socket.on('resetGame', function () {
		try {
			currentGame = new Game();
			updatePlayers();
		} catch(err) {
			updatePlayersOnError(err);
		}
	});
    socket.on('disconnect', function(){
    	try {
	        currentGame.playerLeave(new Player({socketID:socket.id}));
	        updatePlayers();
	    } catch(err) {
		    updatePlayersOnError(err);
	    }
    });
});

function updatePlayers() {
	let json = currentGame.toJSON();
	if(currentGame.playerA.socketID !== undefined) {
		io.sockets.connected[currentGame.playerA.socketID].emit('update',json);
	}
	if(currentGame.playerB.socketID !== undefined) {
		io.sockets.connected[currentGame.playerB.socketID].emit('update',json);
	}/*
    for(let i = 0; i < currentGame.watchers.length; i++) {
        io.sockets.connected[currentGame.watchers[i]].emit('update',json);
    }*/
}
function updatePlayersOnError(err) {
	console.log('ERROR: '+err.message);
}
