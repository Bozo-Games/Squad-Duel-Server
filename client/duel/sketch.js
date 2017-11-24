//let hand1 = new hand();
//let hand2 = new hand({owner:1});
let game = new Game({playerHand : new hand() , oppHand : new hand({owner:1}) });

var mouseHit = false;


function setup() {
	var canvas = createCanvas(800, 600);
	canvas.parent('game');

}

function draw() {
	background(180);  
	game.draw();
	//hand2.draw();
}
