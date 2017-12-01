"use strict";
let socket = io();
socket.on('update', function(gameData){
    game = new Game(gameData);
});
socket.on('debug msg', function(msg){
    console.log(msg);
});
socket.on('new game', function(data){
    location.reload();
});

let network = {
    logIn: function(userName) {
        socket.emit(Routes.logIn,userName);
        logInDiv.remove();
    },
    selectCard: function(cardJSON) {
        socket.emit(Routes.selectCard,cardJSON);
    },
    didSelectAttack: function (attackJSON) {
        socket.emit('selected attack',attackJSON);
    },
    getUpdate: function () {
       socket.emit(Routes.getUpdate);
    },
    newGame: function () {
        socket.emit(Routes.newGame);
    }
};