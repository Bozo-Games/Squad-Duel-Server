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
				option.animation = {
					startFrame:{t:400},
					endFrame:{y:height/5},
					callBack:function () {
						this.removeSubSprite(option);
					}.bind(this)
				};
			}

			this.state = json.state;
			let optionSize = (this.w / (json.currentOptions.length+1));
			let optionX = optionSize / (json.currentOptions.length+1) ; //calculate the gap
			let optionStep = optionSize+optionX; //set the step
			optionX = -this.w/2 + optionX + optionSize/2; //move to start

			if(json.state === 'archetypeSelect') {
				this.currentOptions = [];
				for(let optionJSON of json.currentOptions) {
					this.currentOptions.push(new ArchetypeDraftView({parentSprite:this,
						x:optionX,
						y:this.h/2 - this.h/10,
						w:optionSize,
						h:optionSize}));
					this.currentOptions[this.currentOptions.length-1].loadJSON(optionJSON);
					optionX += optionStep;
				}
			} else if(json.state === 'titleSelect') {
				this.archetype = this.currentOptions.find(function (option) {
					return option.id === json.archetype.id;
				});
				let oldX = this.archetype.local.x;
				let oldY = this.archetype.local.y+this.h/2 -this.h/10;
				this.archetype.x = 0;
				this.archetype.y = -this.h / 2 + this.h / 10;
				this.addSubSprite(this.archetype);
				this.archetype.animation = {
					startFrame: {x: oldX, y: oldY, t: 1200},
					endFrame: {x: 0, y: 0}
				};
				this.currentOptions = [];
				for(let optionJSON of json.currentOptions) {
					this.currentOptions.push(new TitleDraftView({parentSprite:this,
						x:optionX,
						y:this.h/2 - this.h/10,
						w:optionSize,
						h:optionSize}));
					this.currentOptions[this.currentOptions.length-1].loadJSON(optionJSON);
					optionX += optionStep;
				}
			} else if(json.state === 'abilitySelect') {
				this.title = this.currentOptions.find(function (option) {
					return option.id === json.title.id;
				});
				let oldX = this.title.local.x;
				let oldY = this.title.local.y+this.h/2 -this.h/10;
				this.title.x = 0;
				this.title.y = -this.h / 2 + 2.5*this.h / 10;
				this.addSubSprite(this.title);
				this.title.animation = {
					startFrame: {x: oldX, y: oldY, t: 1200},
					endFrame: {x: 0, y: 0}
				};
				this.currentOptions = [];
				for(let optionJSON of json.currentOptions) {
					this.currentOptions.push(new TitleDraftView({parentSprite:this,
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
		if(this.state === 'archetypeSelect') {
			text('Drafting: Archetype',0,-this.h/2);
		} else if(this.state === 'titleSelect') {
			text('Drafting: Title',0,-this.h/2);
		}
		rectMode(CENTER,CENTER);
		rect(0,this.h/2 - this.h/10,this.w,this.h/5);

		super.drawSubSprites();
		pop();
	}
}