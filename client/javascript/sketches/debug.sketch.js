let chars = [];

function preload() {
	icons.loading = loadImage('./Assets/icons/uncertainty.svg');
	icons.getCharacter('Knight','idle');
}

function setup() {
	createCanvas(750/1334 * windowHeight,windowHeight);
	loadAssets(icons);
}

function windowResized() {
	createCanvas(750/1334 * windowHeight,windowHeight);
}

function draw() {
	background(180);
	for(let cha of chars) {
		cha.draw();
	}
}

function touchEnded() {
	for(let cha of chars) {
		cha.loadJSON({name:cha.name})
	}
	let cha = new WanderCharacterView({
			x:width/2,
			y:height/2,
			w:100,
			h:100,
		});
	cha.loadJSON({name:'Wanderer '+(chars.length+1)})
	chars.push(cha);

}
