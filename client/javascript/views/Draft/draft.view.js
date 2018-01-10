class DraftView extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.borderWidth = 0;
		json.color = '#000';
		super(json);
		this.state = 'new';
		this.step = 0;
		this.currentOptions = [];
		this.abilities = [];
	}

	animate(json) {
		json = json === undefined ? {} : json;
		if(this.state !== json.state || json.abilities.length !== this.abilities.length) {
			for(let option of this.currentOptions) {
				option.animation = {
					startFrame:{t:400},
					endFrame:{y:height/5},
					callBack:function () {
						this.removeSubSprite(option);
					}.bind(this)
				};
			}
			let optionSize = (this.w / (json.currentOptions.length+1));
			let optionX = optionSize / (json.currentOptions.length+1) ; //calculate the gap
			let optionStep = optionSize+optionX; //set the step
			optionX = -this.w/2 + optionX + optionSize/2; //move to start

			if(json.state === 'archetypeSelect' && this.state === 'new') {
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
				this.animateArchetypeMoveUp(optionSize);
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
			} else if(json.state === 'abilitySelect' && this.state === 'titleSelect') {
				this.title = this.currentOptions.find(function (option) {
					return option.id === json.title.id;
				});
				this.animateTitleMoveUp(optionSize);
				this.currentOptions = [];
				for(let optionJSON of json.currentOptions) {
					this.currentOptions.push(new AbilityDraftView({parentSprite:this,
						x:optionX,
						y:this.h/2 - this.h/10,
						w:optionSize,
						h:optionSize}));
					this.currentOptions[this.currentOptions.length-1].loadJSON(optionJSON);
					optionX += optionStep;
				}
			} else if(json.state === 'abilitySelect') {
				let ability = this.currentOptions.find(function (option) {
					if(json.abilities.length > this.abilities.length) {
						return option.id === json.abilities[this.abilities.length].id;
					} else {
						return false;
					}
				}.bind(this));
				if(ability) {
					this.abilities.push(ability);
					this.animateAbilityMoveUp(optionSize);
				}
				this.currentOptions = [];
				for(let optionJSON of json.currentOptions) {
					this.currentOptions.push(new AbilityDraftView({parentSprite:this,
						x:optionX,
						y:this.h/2 - this.h/10,
						w:optionSize,
						h:optionSize}));
					this.currentOptions[this.currentOptions.length-1].loadJSON(optionJSON);
					optionX += optionStep;
				}
			} else if(json.state === 'benchAbilitySelect') {
				let ability = this.currentOptions.find(function (option) {
					if(json.abilities.length > this.abilities.length) {
						return option.id === json.abilities[this.abilities.length].id;
					} else {
						return false;
					}
				}.bind(this));
				if(ability) {
					this.abilities.push(ability);
					this.animateAbilityMoveUp(optionSize);
				}
				this.currentOptions = [];
				for(let optionJSON of json.currentOptions) {
					this.currentOptions.push(new BenchAbilityDraftView({parentSprite:this,
						x:optionX,
						y:this.h/2 - this.h/10,
						w:optionSize,
						h:optionSize}));
					this.currentOptions[this.currentOptions.length-1].loadJSON(optionJSON);
					optionX += optionStep;
				}
			} else if(json.state === 'finished') {
				this.benchAbility = this.currentOptions.find(function (option) {
					return option.id === json.benchAbility.id;
				});
				this.animateBenchAbilityMoveUp(optionSize,json);
			}

			this.state = json.state;
		}
	}
	animateArchetypeMoveUp(optionSize) {
		this.archetype.touchEnabled = false;
		let oldX = this.archetype.global.x;
		let oldY = this.archetype.global.y;// + this.h/2;
		this.archetype.x = 0;
		this.archetype.y = 0;
		this.addSubSprite(this.archetype);
		this.archetype.animation = {
			startFrame: {x: oldX, y: oldY, t: 1200, mode:{x:'g',y:'g'}},
			endFrame: {x: this.w/2, y: this.h/5 - optionSize/2}
		};
	}
	animateTitleMoveUp(optionSize) {
		this.title.touchEnabled = false;
		let oldX = this.title.global.x;
		let oldY = this.title.global.y;// + this.h/2;
		this.title.x = 0;
		this.title.y = 0;
		this.addSubSprite(this.title);
		this.title.animation = {
			startFrame: {x: oldX, y: oldY, t: 1000, mode:{x:'g',y:'g'}},
			endFrame: {x: this.w/2, y: this.h*(2/5) - optionSize/2}
		};
	}
	animateAbilityMoveUp(optionSize) {
		this.abilities[this.abilities.length-1].touchEnabled = false;
		let oldX = this.abilities[this.abilities.length-1].global.x;
		let oldY = this.abilities[this.abilities.length-1].global.y;// + this.h/2;
		this.abilities[this.abilities.length-1].x = 0;
		this.abilities[this.abilities.length-1].y = 0;
		this.addSubSprite(this.abilities[this.abilities.length-1]);
		let xOff = -optionSize;
		if(this.abilities.length>1){xOff=optionSize;}
		this.abilities[this.abilities.length-1].animation = {
			startFrame: {x: oldX, y: oldY, t: 800, mode:{x:'g',y:'g'}},
			endFrame: {x: this.w/2+xOff, y: this.h*(3/5) - optionSize/2}
		};
	}
	animateBenchAbilityMoveUp(optionSize, json) {
		this.benchAbility.touchEnabled = false;
		let oldX = this.benchAbility.global.x;
		let oldY = this.benchAbility.global.y;// + this.h/2;
		this.benchAbility.x = 0;
		this.benchAbility.y = 0;
		this.addSubSprite(this.benchAbility);
		this.benchAbility.animation = {
			startFrame: {x: oldX, y: oldY, t: 600, mode:{x:'g',y:'g'}},
			endFrame: {x: this.w/2, y: this.h*(5/5) - optionSize/2},
			callBack: function () {
				this.title.animation = {
					startFrame:{t:400},
					endFrame:{x:this.w/2,y:this.h/2}
				};
				this.benchAbility.animation = {
					startFrame:{t:400},
					endFrame:{x:this.w/2,y:this.h/2}
				};
				this.benchAbility.animation = {
					startFrame:{t:400},
					endFrame:{x:this.w/2,y:this.h/2}
				};
				for(let a of this.abilities) {
					a.animation = {
						startFrame:{t:400},
						endFrame:{x:this.w/2,y:this.h/2}
					};
				}
				this.archetype.animation = {
					startFrame:{t:400},
					endFrame:{x:this.w/2,y:this.h/2},
					callBack: function () {
						this.removeSubSprite(this.archetype);
						this.removeSubSprite(this.title);
						this.removeSubSprite(this.benchAbility);
						for(let a of this.abilities) {
							this.removeSubSprite(a);
						}
						this.character = new DraftCharacterView({
							x: 0,
							y: 0,
							w: this.w / 2,
							h: this.w / 2,
							parentSprite: this
						});
						this.character.loadJSON({id:'draftCharacter',name: this.title.name +' '+this.archetype.name});
						this.endCharacterWalkOffAnimation = Animation.on("animationDone",function (data) {
							if(data.instance.sprite.id === this.character.id) {
								this.endCharacterWalkOffAnimation.off();
								this.removeSubSprite(this.character);
								this.character = undefined;
								this.archetype = undefined;
								this.title = undefined;
								this.abilities = [];
								this.currentOptions = [];
								this.benchAbility = undefined;
								this.state = 'new';
								network.nextDraft();
								//this.loadJSON(json);
							}
						}.bind(this)); //end watcher
					}.bind(this) //end call back
				};
			}.bind(this)
		};
	}

	draw() {
		push();
		super.applyTransformations();
		textAlign(CENTER,TOP);
		if(this.state === 'archetypeSelect') {
			text('Drafting: Archetype',0,-this.h/2+14);
		} else if(this.state === 'titleSelect') {
			text('Drafting: Title',0,-this.h/2+14);
		} else if(this.state === 'abilitySelect') {
			if(this.abilities.length === 0) {
				text('Drafting: 1/2 Abilities',0,-this.h/2+14);
			} else {
				text('Drafting: 2/2 Abilities',0,-this.h/2+14);
			}
		} else if(this.state === 'benchAbilitySelect') {
			text('Drafting: Bench Ability',0,-this.h/2+14);
		}
		rectMode(CENTER,CENTER);
		rect(0,this.h/2 - this.h/10,this.w,this.h/5);

		super.drawSubSprites();
		pop();
	}
}