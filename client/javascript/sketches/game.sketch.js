let currentGame;

function preload() {
	icons.loading = loadImage('./Assets/icons/uncertainty.svg');
	icons.getCharacter('Knight','idle');
}

function setup() {
	createCanvas(750/1334 * windowHeight,windowHeight);
	loadAssets(icons);
	currentGame = new GameView({x:width/2,y:height/2,w:width,h:height});
	network = new Network();
}

function windowResized() {
	createCanvas(750/1334 * windowHeight,windowHeight);
	currentGame.x = width/2;
	currentGame.y = height/2;
	currentGame.w = width;
	currentGame.h = height;
}

function draw() {
	background(180);
	currentGame.draw();
}

function touchEnded() {
	currentGame.touchEnded();
}