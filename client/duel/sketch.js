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

let duel;
function preload() {
    IMG.icon.armor = loadImage('duel/Assets/Icons/armor.svg');
    IMG.icon.character = loadImage('duel/Assets/Icons/character.svg');
    IMG.icon.crushing = loadImage('duel/Assets/Icons/crushing.svg');
    IMG.icon.flat = loadImage('duel/Assets/Icons/flat.svg');
    IMG.icon.health = loadImage('duel/Assets/Icons/health.svg');
    IMG.icon.piercing = loadImage('duel/Assets/Icons/piercing.svg');
    IMG.icon.speed = loadImage('duel/Assets/Icons/speed.svg');
    IMG.icon.defense = loadImage('duel/Assets/Icons/armor.svg');
    IMG.icon.heal = loadImage('duel/Assets/Icons/heal.svg');
    //IMG.icon.background = loadImage('duel/Assets/Icons/Images/background.jpg');

    IMG.icon.characters = [];
    for (let i = 0; i < 54; i++) {    
        IMG.icon.characters.push(loadImage('duel/Assets/Icons/Cards/'+i+'_character.svg'));
    }

}
function setup() {
	canvas = createCanvas(800, 600);
    //background(IMG.icon.background);
	canvas.parent('game');
    game = new Game();//{playerHand : new hand() , oppHand : new hand({owner:1}) });
    
    network.getUpdate();
	//fill('Black');
    duel = new Duel();

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
    duel.draw();
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