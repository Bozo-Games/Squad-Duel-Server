let cha;
function preload() {
	icons.loading = loadImage('./Assets/icons/uncertainty.svg');
	icons.getCharacter('Knight','idle');
}

function setup() {
	createCanvas(750/1334 * windowHeight,windowHeight);
	loadAssets(icons);

	cha = new WanderCharacterView({
		x:width/2,
		y:height/2,
		w:100,
		h:100,
	});
	cha.loadJSON({name:'Wandering'})
}

function windowResized() {
	createCanvas(750/1334 * windowHeight,windowHeight);
}

function draw() {
	background(180);
	cha.draw()
}

function touchEnded() {

}