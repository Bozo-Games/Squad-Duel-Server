class AttackComat extends Attack {
	constructor(json) {
		json = json === undefined ? {} : json;
		super(json);
	}

	draw(){
		this.applyAnimations();
		textAlign(CENTER,CENTER);
		text(this.name,0,0);
		rect(0,this.bounds.h/2,this.bounds.w,this.bounds.h/2+10);
		this.drawSubViews();
	}
}