
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


const Player = require('./server/Models/Player.js');
const E = require('./client/duel/Helpers/enums.js');
const Game = require('./server/Models/Game.js');
const Card = require('./server/Models/Card.js');
const Routes = require('./client/duel/Network/socketRoutes.js');
let currentGame = new Game();
io.on('connection', function(socket) {
    socket.on(Routes.getUpdate, function () {
        console.log('update ' + socket.id);
        socket.emit('update',currentGame.toJSON());
    });
    socket.on(Routes.logIn, function (userName) {
        currentGame.playerJoin(new Player({socketID:socket.id, name:userName}));
        updatePlayers();
    });
    socket.on(Routes.selectCard,function (cardJSON) {
        console.log('A magic card was selected');
        console.log(cardJSON);
        currentGame.selectCard(new Player({socketID:socket.id}), new Card(cardJSON));
        updatePlayers();
    });
    socket.on(Routes.selectAttack, function (attackJSON) {
        currentGame.selectAttack(new Player({socketID:socket.id}), new Card(attackJSON));
        updatePlayers();
    });
    socket.on(Routes.newGame, function () {
        currentGame = new Game();
        updatePlayers();
    });
    socket.on('disconnect', function(){
        console.log('disconnecting');
        currentGame.playerLeave(new Player({socketID:socket.id}));
        console.log(currentGame.playerA.socketID );
        updatePlayers();
    });
});

function updatePlayers() {
    let json = currentGame.toJSON();
    if(currentGame.currentState !== E.GameStates.NewGame) {
        console.log(json.handA.cards[0].attacks[0]);
    }
    if(currentGame.playerA.socketID !== undefined) {
        console.log(currentGame.playerA.socketID);
        io.sockets.connected[currentGame.playerA.socketID].emit('update',json);
    }
    if(currentGame.playerB.socketID !== undefined) {
        io.sockets.connected[currentGame.playerB.socketID].emit('update',json);
    }
    for(let i = 0; i < currentGame.watchers.length; i++) {
        io.sockets.connected[currentGame.watchers[i]].emit('update',json);
    }
}
