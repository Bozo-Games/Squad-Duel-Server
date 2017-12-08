
"use strict";
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/duel/index.html');
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
        currentGame.playerJoin(new Player({socketID:socket.id, name:userName}));
        updatePlayers();
    });
    socket.on('selectCard',function (cardID) {
        currentGame.selectCard(socket.id,cardID);
        updatePlayers();
    });
	socket.on('confirmCard', function (cardID) {
		currentGame.confirmCard(socket.id,cardID);
		updatePlayers();
	});
    socket.on('selectAttack', function (attackJSON) {
        currentGame.selectAttack(socket.id, attackJSON.id);
        updatePlayers();
    });
	socket.on('resetGame', function () {
		currentGame = new Game();
		updatePlayers();
	});
    socket.on('disconnect', function(){
        currentGame.playerLeave(new Player({socketID:socket.id}));
        updatePlayers();
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
