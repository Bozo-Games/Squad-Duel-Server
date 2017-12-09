"use strict";
let currentGame;
function preload() {
	loadAssets(icons);
}
function setup() {
	createCanvas(windowWidth,windowHeight);
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