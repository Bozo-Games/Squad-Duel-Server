class FieldView extends Sprite {
	constructor(json) {
		super(json);
		let bw = this.h/3;
		this.playerBench = new FieldSectionView({parentSprite:this, x:0,y:2*bw/2,  w:this.w, h:this.h/3});
		this.playerSide =  new FieldSectionView({parentSprite:this, x:0,y:bw/2,    w:this.w, h:this.h/3});
		this.middle =      new FieldSectionView({parentSprite:this, x:0,y:0,       w:this.w, h:this.h/3});
		this.oppSide =     new FieldSectionView({parentSprite:this, x:0,y:-bw/2,   w:this.w, h:this.h/3});
		this.oppBench =    new FieldSectionView({parentSprite:this, x:0,y:-2*bw/2, w:this.w, h:this.h/3});

	}
	animate(json) {
		this.playerBench.loadJSON(json['bench'+network.playerLetter]);
		this.playerSide.loadJSON(json['side'+network.playerLetter]);
		this.middle.loadJSON(json.middle);
		this.oppBench.loadJSON(json['bench'+network.oppLetter]);
		this.oppSide.loadJSON(json['side'+network.oppLetter]);
	}
	draw() {
		push();
		super.applyTransformations();
		super.drawSubSprites();
		pop();
	}
}