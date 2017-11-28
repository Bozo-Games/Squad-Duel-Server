"use strict";
//let hand1 = new hand();
//let hand2 = new hand({owner:1});
let game;

let mouseHit = false;
let logInDiv;
let canvas;
let input;
let logInBtn;

//image globals
let IMG = {
    icon: {
        armor: undefined,
        character: undefined,
        crushing: undefined,
        flat: undefined,
        health: undefined,
        piercing: undefined,
        speed: undefined,
        defense: undefined,
    }
};


function preload() {
    IMG.icon.armor = loadImage('duel/Icons/armor.svg');
    IMG.icon.character = loadImage('duel/Icons/character.svg');
    IMG.icon.crushing = loadImage('duel/Icons/crushing.svg');
    IMG.icon.flat = loadImage('duel/Icons/flat.svg');
    IMG.icon.health = loadImage('duel/Icons/health.svg');
    IMG.icon.piercing = loadImage('duel/Icons/piercing.svg');
    IMG.icon.speed = loadImage('duel/Icons/speed.svg');
    IMG.icon.defense = loadImage('duel/Icons/armor.svg');
}
function setup() {
	canvas = createCanvas(800, 600);
	canvas.parent('game');
	game = new Game();//{playerHand : new hand() , oppHand : new hand({owner:1}) });
	network.getUpdate();
	//fill('Black');

    logInDiv = createDiv("");
    logInDiv.position(200,150);
    logInDiv.size(400,300);
    logInDiv.class('logInOverlay');
    input = createInput();
    input.position(50,100);
    input.size(300,50);
    input.parent(logInDiv);
    logInBtn = createButton("Join Game");
    logInBtn.position(50,200);
    logInBtn.size(300,50);
    logInBtn.parent(logInDiv);
    logInBtn.mousePressed(logUserIn);
}

function windowResized() {
	if (windowWidth < 800 || windowHeight < 600 ) {
 		resizeCanvas(windowWidth, windowHeight);
 	} else {
 		resizeCanvas(800, 600);
 	}
}

function draw() {
	background(180);  
	game.draw(width,height);
}
function mouseMoved() {
    game.mouseMoved();
    return false; //prevents HTML defualts
}
function mouseReleased() {
	game.mouseReleased();
  	return false;//prevents HTML defualts
}
function debug() {
    network.newGame();
    location.reload();
}
function logUserIn(){
    network.logIn(input.value());
}