class DraftCharacterView extends CharacterView {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.borderWidth = 0;
		super(json);

	}

	draw() { //todo move over to extend duel view only change is the animate
		push();
		super.applyTransformations();
		imageMode(CENTER);
		let img = icons.getCharacter('Knight', this.lastAnimationData.loop,this.loopOffSet);
		image(img,0,-100,this.w,this.h);
		textAlign(CENTER,CENTER);
		fill('#000');
		text(this.name,0,0);
		pop()
	}

	animate(json) {
		super.animate(json); //called bcause we want default json load before we do any animation
		this.animation = {
			startFrame:{t:1000,loop:'idle'},
			keyFrames:[
				{loop:'attack',t:300},
				{y:-50,t:300},
				{y:0,t:1000,loop:'walk'}
			],
			endFrame:{x:width/2 + this.w/1.5}
		}
	}
}