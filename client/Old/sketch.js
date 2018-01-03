
let currentGame;
let d;
let frameTime = (new Date()).getTime();
function preload() {
	icons.loading = loadImage('./Assets/icons/uncertainty.svg');
}
function setup() {
	createCanvas(750/1334 * windowHeight,windowHeight);
	loadAssets(icons);
	createLogInView();
}
function windowResized() {
	createCanvas(750/1334 * windowHeight,windowHeight);
	currentGame = new Game(lastGameData);
}
function draw() {
	frameTime = (new Date()).getTime();
	background(180);
	if(currentGame !== undefined) {
		if(currentGame.currentState === 'endGame') {
			textAlign(CENTER,CENTER);
			textStyle(30);
			let aliveCount = 0;
			for(let card in currentGame.playerHand.cards) {
				if(card.currentState !== 'dead') {
					aliveCount++;
				}
			}
			if(aliveCount > 0) {
				text("YOU WON",width/2,height/2);
			} else {
				text("YOU LOST",width/2,height/2);
			}
		} else {
			currentGame.draw();
		}
	}
}
function touchEnded() {
	if(currentGame !== undefined) {currentGame.touchEnded();}
  	return false;
}