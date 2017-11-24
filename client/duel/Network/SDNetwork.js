
let socket = io();

socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
});

let network = {
    logIn: function(userName) {
        socket.emit('log in',userName);
    }
};