
function preload() {
	icons.loading = loadImage('./Assets/icons/uncertainty.svg');
}

function setup() {
	createCanvas(750/1334 * windowHeight,windowHeight);
	loadAssets(icons);
	network = new Network();

}

function windowResized() {
	createCanvas(750/1334 * windowHeight,windowHeight);
}

function draw() {
	background(180);
}

function touchEnded() {

}