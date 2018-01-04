class FieldSectionView extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		super(json);
		let bw = this.h;
		this.biomes = [
			new BiomeView({parentSprite:this,x:bw/2 ,y:bw/4, w:bw,h:bw}),
			new BiomeView({parentSprite:this,x:0    ,y:0,    w:bw,h:bw}),
			new BiomeView({parentSprite:this,x:-bw/2,y:-bw/4,w:bw,h:bw})
			];
	}
	animate(json) {
		for(let b of this.biomes) {
			b.loadJSON(json);
		}
	}
	draw() {
		push();
		super.applyTransformations();
		super.drawSubSprites();
		pop();
	}
}