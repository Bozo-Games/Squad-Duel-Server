"use strict";
let currentGame;
function preload() {
	icons.loading = loadImage('./Assets/icons/uncertainty.svg');
}
function setup() {
	createCanvas(windowWidth,windowHeight);
	loadAssets(icons);
	createLogInView();
}
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
function draw() {
	background(180);
	if(currentGame !== undefined) {	currentGame.draw(); }
}
function touchEnded() {
	if(currentGame !== undefined) {currentGame.touchEnded();}
  	return false;
}