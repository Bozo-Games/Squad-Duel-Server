
"use strict";
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/client/duel/index.html');
});
app.use( express.static('client'));
http.listen(3000, function(){
    console.log('listening on *:3000');
});


const Player = require('./server/Player.js');
const Game = require('./server/Game.js');
let game = new Game();
io.on('connection', function(socket) {
    socket.on('disconnect', function(){
        console.log(socket.id + 'disconnected');
        if(game.playerA.socketID === socket.id) {
            game.playerA = new Player();
        } else if (game.playerB.socketID === socket.id) {
            game.playerB = new Player();
        }
    });
    socket.on('log in', function(userName){
        if(game.playerA.socketID !== undefined) {
            if(game.playerB.socketID !== undefined) {
                game.watchers.push(socket.id);
                console.log('new Game watcher ' + socket.id);
                io.sockets.connected[socket.id].emit('debug msg','you have become a watcher');
            } else {
                game.playerB.socketID = socket.id;
                game.playerB.name = userName;
                game.playerB.status = 'Filled'
                console.log(userName +' is logging in as Player B');
                io.sockets.connected[game.playerB.socketID].emit('debug msg','you have logged into Player B');
            }
        } else {
            game.playerA.socketID = socket.id;
            game.playerA.name = userName;
            game.playerA.status = 'Filled';
            console.log(userName +' is logging in as Player A');
            io.sockets.connected[game.playerA.socketID].emit('debug msg','you have logged into Player A');
        }
        updatePlayers();
    });
    socket.on('selected card', function(cardJSON){
        if(socket.id === game.playerA.socketID) {
            if(game.selectedCardA === undefined) {

            } else {

            }
        } else if(socket.id === game.playerB.socketID) {

        }
        updatePlayers();
    });
    socket.on('reset game', function (cardJSON) {
        game = new Game();
        for(let i =0 ; i < io.sockets.connected.length; i++) {
            io.sockets.connected[i].emit('new game',{});
        }
    });
});

function updatePlayers() {
    let json = game.toJSON();

    if(game.playerA.socketID !== undefined) {
        io.sockets.connected[game.playerA.socketID].emit('updateGameData',json);
    }
    if(game.playerB.socketID !== undefined) {
        io.sockets.connected[game.playerB.socketID].emit('updateGameData',json);
    }
    for(var i = 0; i < game.watchers.length; i++) {
        io.sockets.connected[game.watchers[i]].emit('updateGameData',json);
    }
}
