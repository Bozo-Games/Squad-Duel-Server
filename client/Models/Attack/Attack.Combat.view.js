class AttackComat extends Attack {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.fillColor = '#000000';
		super(json);
	}

	draw(){
		push();
		this.applyTransformations();
		textAlign(CENTER,CENTER);
		rect(0,this.h/2,(this.w - textWidth(this.name)) / 2.1,2);
		rect(this.w - (this.w - textWidth(this.name)) / 2.1,this.h/2,(this.w - textWidth(this.name)) / 2.1,2);
		text(this.name,this.w/2,this.h/2);
		this.drawSubSprites();
		pop();
	}
}