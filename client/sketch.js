"use strict";
function preload() {

}
function setup() {
	createCanvas(Math.min(windowWidth,750), Math.min(windowHeight,1334));
}
function windowResized() {
	resizeCanvas(Math.min(windowWidth,750), Math.min(windowHeight,1334));
}
function draw() {
	background(180);
}
function touchEnded() {
  	return false;//prevents HTML defualts
}