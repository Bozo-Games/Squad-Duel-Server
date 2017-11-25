"use strict";
let socket = io();
socket.on('updateGameData', function(gameData){
    console.log(gameData);
    game.playerA.socketID =  gameData.playerA.socketID;
    game.playerA.name =  gameData.playerA.name === undefined ? "No one" : gameData.playerA.name;
    game.playerB.soketID = gameData.playerB.socketID;
    game.playerB.name =  gameData.playerB.name === undefined ? "No one" : gameData.playerB.name;

    if(socket.id === game.playerA.socketID ) {
        gameData.handA.owner = 0;
        game.playerHand = new hand(gameData.handA);
        gameData.handB.owner = 1;
        game.oppHand = new hand(gameData.handB);
    } else if(socket.id === game.playerB.socketID) {
        gameData.handB.owner = 0;
        game.playerHand = new hand(gameData.handB);
        gameData.handA.owner = 1;
        game.oppHand = new hand(gameData.handA);
    } else {  //implies Watcher
        gameData.handA.owner = 0;
        game.playerHand = new hand(gameData.handA);
        gameData.handB.owner = 1;
        game.oppHand = new hand(gameData.handB);
    }
});
socket.on('debug msg', function(msg){
    console.log(msg);
});
socket.on('new game', function(data){
    location.reload();
});
socket.on('report hand', function(data){
    if(game.playerHand === undefined) {
        let gh = generateHnad(1);
        game.playerHand = new hand(gh);
    }
    network.reportHand(game.playerHand.toJSON());
});

let network = {
    logIn: function(userName) {
        socket.emit('log in',userName);
        logInDiv.remove();
    },
    reportHand: function (handJSON) {
        socket.emit('reporting hand',handJSON);
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