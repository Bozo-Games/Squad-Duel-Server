
"use strict";
let socket = io();
socket.on('updateGameData', function(gameData){
    console.log(gameData);
    game.playerA.socketID =  gameData.playerA.socketID;
    game.playerA.name =  gameData.playerA.name === undefined ? "No one" : gameData.playerA.name;
    game.playerB.soketID = gameData.playerB.socketID;
    game.playerB.name =  gameData.playerB.name === undefined ? "No one" : gameData.playerB.name;
});
socket.on('debug msg', function(msg){
    console.log(msg);
});

let network = {
    logIn: function(userName) {
        socket.emit('log in',userName);
        logInDiv.remove();
    },
    didSelectCard: function(cardJSON) {
        socket.emit('selected card',cardJSON);
    },
    didSelectAttack: function (attackJSON) {
        socket.emit('selected attack',attackJSON);
    },
    resetGame: function () {
       socket.emit('reset game');
    }
};