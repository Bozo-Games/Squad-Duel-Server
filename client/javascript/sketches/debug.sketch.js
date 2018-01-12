let chars = [];
let cha;
let json = {
	"id": "5e99dae4-4e8b",
	"name": "Arcane Barbarian",
	"state": "bench",
	"health": 20,
	"armor": 3,
	"speed": 2,
	"power": 4,
	"stamina": 10,
	"currentStamina": 10
};
let p;
function preload() {
	icons.loading = loadImage('./Assets/icons/uncertainty.svg');
	icons.getCharacter('Knight','idle');
}

function setup() {
	createCanvas(750/1334 * windowHeight,windowHeight);
	loadAssets(icons);
	cha = new BenchCharacterView({
		x:width/2,
		y:height/2,
		w:200,
		h:200
	});
	p = new ParticleView({w:10,h:10, maxCount:100});
	cha.addSubSprite(p);
	cha.debug = true;
	cha.loadJSON(json);
}

function windowResized() {
	createCanvas(750/1334 * windowHeight,windowHeight);
}

function draw() {
	background(180);
	cha.draw();
}

function touchEnded() {
	json.armor --;
	cha.loadJSON(json)

}
