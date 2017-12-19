
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
	if(currentGame !== undefined) {	currentGame.draw(); }
}
function touchEnded() {
	if(currentGame !== undefined) {currentGame.touchEnded();}
  	return false;
}