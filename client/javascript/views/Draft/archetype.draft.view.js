class ArchetypeDraftView extends Sprite {
	constructor(json) {
		json.borderWidth = 0;

		json = json === undefined ? {} : json;
		super(json);
		this.name = 'no name';
		this.id = -1;
	}
	animate(json) {
		this.name = json.name;
		this.id = json.id;
	}
	draw() {
		push();
		super.applyTransformations();
		ellipseMode(CENTER);
		ellipse(0,0,this.w,this.h);
		textAlign(CENTER,CENTER);
		fill('#000');
		text(this.name,0,0);
		super.drawSubSprites();
		pop();
	}
	touchEnded() {
		if(super.touchEnded()) {
			network.draftArchetype(this.id);
		}
	}
}