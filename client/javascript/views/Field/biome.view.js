class BiomeView extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		super(json);
		this.biome = json.biome === undefined ? 'grass' : json.biome;
		this.number = json.number
	}


	draw() {
		push();
		super.applyTransformations();
		imageMode(CENTER,CENTER);
		image(icons.field[this.biome],0,0,this.w,this.h);
		textAlign(CENTER,CENTER);
		text(this.number,0,0);
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
		} else if(this.number === 32) {
			console.log(mouseY-this.global.y +' >= ' +((-this.global.h/4) / (this.global.w/2)) * (mouseX-this.global.x) + 0 )
		}
	}
}

