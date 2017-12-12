let socket = io();
let gd;
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
		savePlayerCardStartJSON = gd.duel['card'+currentGame.playerLetter];
		saveOppCardStartJSON = gd.duel['card'+currentGame.oppLetter];
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
let gdh =[];
let gdi = -1;
socket.on('update', function(gameData){
	gd = gameData;
	gdh.push(JSON.parse(JSON.stringify(gd)));
	gdi++;
	if(currentGame === undefined) {
		currentGame = new Game(gameData);
	} else {
		currentGame.loadJSON(gameData);
	}
});

function rollBackGD(iDelta) {
	if(gdi + iDelta >=0 && gdi < gdh.length) {
		gdi = gdi+iDelta;
		currentGame = new Game(gdh[gdi]);
	}
}
function stepGDH() {
	gdi = Math.min(gdi+1,gdh.length-1);
	currentGame.loadJSON(gdh[gdi])
}
