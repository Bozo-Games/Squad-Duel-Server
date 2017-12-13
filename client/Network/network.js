let socket = io();
let lastGameData;
let savePlayerCardStartJSON; //hacky don't like
let saveOppCardStartJSON; //hacky don't like
const network = {
	logIn: function (userName) {
		socket.emit('logIn',userName);
		hideLogInView();
	},
	selectCard: function (cardID) {
		socket.emit('selectCard',cardID);
	},
	selectAttack: function (attackID) {
		savePlayerCardStartJSON = lastGameData.duel['card'+currentGame.playerLetter];
		saveOppCardStartJSON = lastGameData.duel['card'+currentGame.oppLetter];
		socket.emit('selectAttack',attackID);
	},
	lockIn:function (cardID) {
		socket.emit('confirmCard',cardID);
	},
	acceptResults: function () {
		socket.emit('acceptResults');
	},
	processDuel:function () {
		socket.emit('processDuel');
	}
};
let gameDataHistory =[];
let gameDataIndex = -1;
socket.on('update', function(gameData){
	lastGameData = gameData;
	gameDataHistory.push(JSON.parse(JSON.stringify(lastGameData)));
	gameDataIndex++;
	if(currentGame === undefined) {
		currentGame = new Game(gameData);
	} else {
		currentGame.loadJSON(gameData);
	}
});

function rollBackGD(iDelta) {
	if(gameDataIndex + iDelta >=0 && gameDataIndex < gameDataHistory.length) {
		gameDataIndex = gameDataIndex+iDelta;
		currentGame = new Game(gameDataHistory[gameDataIndex]);
	}
}
function stepGDH() {
	gameDataIndex = Math.min(gameDataIndex+1,gameDataHistory.length-1);
	currentGame.loadJSON(gameDataHistory[gameDataIndex])
}
