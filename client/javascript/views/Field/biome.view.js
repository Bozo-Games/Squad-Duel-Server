class BiomeView extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		super(json);
		this.biome = json.biome;
	}


	draw() {
		push();
		super.applyTransformations();
		if(this.biome !== undefined) {
			imageMode(CENTER, CENTER);
			image(icons.field[this.biome], 0, 0, this.w, this.h);
			textAlign(CENTER, CENTER);
		}
		super.drawSubSprites();
		pop();
	}
	touchEnded() {
		if(
			mouseY-this.global.y <= ((-this.global.h/4) / (this.global.w/2)) * (mouseX-this.global.x) + 0 &&
			mouseY-this.global.y >= ((-this.global.h/4) / (this.global.w/2)) * (mouseX-this.global.x) - this.global.h/2 &&
			mouseY-this.global.y <= ((-this.global.h/4) / (-this.global.w/2)) * (mouseX-this.global.x) + 0 &&
			mouseY-this.global.y >= ((-this.global.h/4) / (-this.global.w/2)) * (mouseX-this.global.x) - this.global.h/2
		) {
			this.animation = {
				keyFrames:[
					{x:random(-10,10),y:random(-10,10),t:100},
					{x:random(-10,10),y:random(-10,10),t:100},
					{x:random(-10,10),y:random(-10,10),t:100},
					{x:random(-10,10),y:random(-10,10),t:100},
					{x:random(-10,10),y:random(-10,10),t:100}
				],
				endFrame: {x:0,y:0}
			};
		}
	}

	animate(json) {
		if(this.biome === undefined) {
			this.biome = json.biome;
			this.animation = {
				startFrame: {x: 0, y: -height*2,t:random(200,2000)},
				keyFrames: [{x:0,y:0}]
			}
		}
	}
}

