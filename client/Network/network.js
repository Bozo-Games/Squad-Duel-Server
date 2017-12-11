let socket = io();
let gd;
const network = {
	logIn: function (userName) {
		socket.emit('logIn',userName);
		hideLogInView();
	},
	selectCard: function (cardID) {
		socket.emit('selectCard',cardID);
	},
	selectAttack: function (attackID) {
		socket.emit('selectAttack',attackID);
	},
	lockIn:function (cardID) {
		socket.emit('confirmCard',cardID);
	},
	processDuel:function () {
		socket.emit('processDuel');
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