"use strict";
//let hand1 = new hand();
//let hand2 = new hand({owner:1});
let game = new Game({playerHand : new hand() , oppHand : new hand({owner:1}) });

let mouseHit = false;
let logInDiv;
let canvas;
let input;
let logInBtn;
function setup() {
	canvas = createCanvas(800, 600);
	canvas.parent('game');

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

function draw() {
	background(180);  
	game.draw();
	//hand2.draw();
}

function logUserIn(){
    network.logIn(input.value());
}