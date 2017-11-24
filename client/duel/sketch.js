let game;
var mouseHit = false;


function setup() {
	var canvas = createCanvas(800, 600);
	canvas.parent('game');
	game = new Game({playerHand : new hand() , oppHand : new hand({owner:1}) });

}

function draw() {
	background(180);  
	game.draw();
	//hand2.draw();
}

let attackList  = 
{
"0":{attackId: 0,flat : 10, crushing: 0, piercing: 0, defense: 0, speed: 0, attackName : "Strong Strike"},
"1":{attackId: 1,flat : 8, crushing: 0, piercing: 0, defense: 0, speed: 1, attackName : "Fierce Strike"},
"2":{attackId: 2,flat : 6, crushing: 0, piercing: 0, defense: 0, speed: 2, attackName : "Swift Strike"},
"3":{attackId: 3,flat : 4, crushing: 0, piercing: 0, defense: 0, speed: 3, attackName : "Lightning Strike"},
"4":{attackId: 4,flat : 0, crushing: 5, piercing: 0, defense: 0, speed: 0, attackName : "Strong Bash"},
"5":{attackId: 5,flat : 0, crushing: 4, piercing: 0, defense: 0, speed: 1, attackName : "Fierce Bash"},
"6":{attackId: 6,flat : 0, crushing: 3, piercing: 0, defense: 0, speed: 2, attackName : "Swift Bash"},
"7":{attackId: 7,flat : 0, crushing: 0, piercing: 5, defense: 0, speed: 0, attackName : "Strong Pierce"},
"8":{attackId: 8,flat : 0, crushing: 0, piercing: 4, defense: 0, speed: 1, attackName : "Fierce Pierce"},
"9":{attackId: 9,flat : 0, crushing: 0, piercing: 3, defense: 0, speed: 2, attackName : "Swift Pierce"},
"10":{attackId: 10,flat : 0, crushing: 0, piercing: 0, defense: 5, speed: 5, attackName : "Block"}
}

let cardList = 
{"0":{cardId : 0, health : 24, armor : 0, speed : 0},
"1":{cardId : 1, health : 22, armor : 1, speed : 0},
"2":{cardId : 2, health : 20, armor : 2, speed : 0},
"3":{cardId : 3, health : 18, armor : 3, speed : 0},
"4":{cardId : 4, health : 16, armor : 4, speed : 0},
"5":{cardId : 5, health : 14, armor : 5, speed : 0},
"7":{cardId : 7, health : 22, armor : 0, speed : 1},
"8":{cardId : 8, health : 20, armor : 1, speed : 1},
"9":{cardId : 9, health : 18, armor : 2, speed : 1},
"10":{cardId : 10, health : 16, armor : 3, speed : 1},
"11":{cardId : 11, health : 14, armor : 4, speed : 1},
"12":{cardId : 12, health : 20, armor : 0, speed : 2},
"13":{cardId : 13, health : 18, armor : 1, speed : 2},
"14":{cardId : 14, health : 16, armor : 2, speed : 2},
"15":{cardId : 15, health : 14, armor : 3, speed : 2},
"16":{cardId : 16, health : 18, armor : 0, speed : 3},
"17":{cardId : 17, health : 16, armor : 1, speed : 3},
"18":{cardId : 18, health : 14, armor : 2, speed : 3}
}