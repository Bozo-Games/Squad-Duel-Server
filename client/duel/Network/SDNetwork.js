
let socket = io();
socket.on('updateGameData', function(gameData){
    console.log(gameData);
});
socket.on('debug msg', function(msg){
    console.log(msg);
});

let network = {
    logIn: function(userName) {
        socket.emit('log in',userName);
    },


};