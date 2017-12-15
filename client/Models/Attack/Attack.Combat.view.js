class AttackComat extends Attack {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.fillColor = '#000000';
		super(json);
	}

	draw(){
		push();
		this.applyAnimations();
		textAlign(CENTER,CENTER);
		rect(0,this.bounds.h/2,(this.bounds.w - textWidth(this.name)) / 2.1,2);
		rect(this.bounds.w - (this.bounds.w - textWidth(this.name)) / 2.1,this.bounds.h/2,(this.bounds.w - textWidth(this.name)) / 2.1,2);
		text(this.name,this.bounds.w/2,this.bounds.h/2);
		this.drawSubViews();
		pop();
	}
}