class TextParticalView extends ParticleView {
	constructor(json) {
		super(json);
		this.text = json.text === undefined ? '' : json.text;
		this.addParticle();
	}

	drawParticle(p) {
		textAlign(CENTER,CENTER);
		textSize(this.h*p.h);
		text(this.text,p.x,p.y,this.w*p.w,this.h*p.h);
	}

	shouldAddParticle() {
		return false;
	}
}