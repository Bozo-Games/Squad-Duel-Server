let socket = io();
let gd;
const network = {
	logIn: function (userName) {
		socket.emit('logIn',userName);
		hideLogInView();
	},
	selectCard: function (cardID) {
		socket.emit('selectCard',cardID);
	}
};

socket.on('update', function(gameData){
	gd = gameData;
	if(currentGame === undefined) {
		currentGame = new Game(gameData);
	} else {
		currentGame.loadJSON(gameData);
	}
});