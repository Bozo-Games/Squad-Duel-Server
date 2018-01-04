class DraftView extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.borderWidth = 0;
		json.color = '#000';
		super(json);
		this.state = 'new';
		this.step = 0;
		this.currentOptions = [];
	}

	animate(json) {
		if(this.state !== json.state) {
			for(let option of this.currentOptions) {
				this.removeSubSprite(option);
			}
			if(json.state === 'archetypeSelect') {
				this.step = 1;
				this.currentOptions = [];
				let optionSize = (this.w / (json.currentOptions.length+1));
				let optionX = optionSize / (json.currentOptions.length+1) ; //calculate the gap
				let optionStep = optionSize+optionX; //set the step
				optionX = -this.w/2 + optionX + optionSize/2; //move to start
				console.log(`size = ${optionSize}, step = ${optionStep}, initalX = ${optionX}` )
				for(let optionJSON of json.currentOptions) {
					this.currentOptions.push(new ArchetypeDraftView({parentSprite:this,
						x:optionX,
						y:this.h/2 - this.h/10,
						w:optionSize,
						h:optionSize}));
					this.currentOptions[this.currentOptions.length-1].loadJSON(optionJSON);
					optionX += optionStep;
				}
			}
		}
	}

	draw() {
		push();
		super.applyTransformations();
		textAlign(CENTER,TOP);
		text("Drafting "+this.step+'/5',0,-this.h/2);
		rectMode(CENTER,CENTER);
		rect(0,this.h/2 - this.h/10,this.w,this.h/5);

		super.drawSubSprites();
		pop();
	}
}