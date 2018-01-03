let field;
function preload() {
	icons.loading = loadImage('./Assets/icons/uncertainty.svg');
}

function setup() {
	createCanvas(750/1334 * windowHeight,windowHeight);
	loadAssets(icons);
	field = [];

	for(let y = -3; y <= 3; y++) {
		for(let x = 2; x >= -2; x--) {

			field.push(new BiomeView({
				x: y % 2 === 0 ? (width/2 + x*100) : (width/2 + x*100 + 50),
				y: height/2 + y*25,
				number: field.length
			}));
		}
	}
}

function windowResized() {
	createCanvas(750/1334 * windowHeight,windowHeight);
}

function draw() {
	background(180);
	for(let b of field) {
		b.draw();
	}
}

function touchEnded() {

	for(let b of field) {
		b.touchEnded();
	}
}