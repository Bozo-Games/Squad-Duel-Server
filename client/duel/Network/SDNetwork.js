"use strict";
let socket = io();
let gd;
socket.on('update', function(gameData){
    gd = gameData;
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
    selectAttack: function (attackJSON) {
        socket.emit(Routes.selectAttack,attackJSON);
    },
	processDuel: function () {
		socket.emit(Routes.processDuel);
	},
    getUpdate: function () {
       socket.emit(Routes.getUpdate);
    },
    newGame: function () {
        socket.emit(Routes.newGame);
    }
};