class CardDuelPlayer extends Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.strokeWeight = 1;
		json.bounds = json.bounds === undefined ? {x:0,y:0,w:100,h:100} : json.bounds;
		super(json);
		json.bounds = {
			x: this.bounds.w*defaults.card.duel.player.characterScale.x,
			y: this.bounds.h*defaults.card.duel.player.characterScale.y,
			w: this.bounds.h*defaults.card.duel.player.characterScale.h,
			h: this.bounds.h*defaults.card.duel.player.characterScale.h
		};
		json.parentSprite = this;
		this.character = new CardDuelCharacter(json);
		this.attacks = [];
		let h = this.bounds.h / (json.attacks.length+1.5); //1 for space,2 for lock in
		let spaceing = (this.bounds.h - h*(json.attacks.length+1))/2;
		for(let i = 0; i < json.attacks.length; i++) {
			let attackJSON = json.attacks[i];
			let yy = spaceing*(i+1) + h*(i+1);
			attackJSON.bounds = {
				x: this.bounds.w*defaults.card.duel.player.attackScale.x+this.bounds.w*defaults.card.duel.player.attackScale.w*1.2,
				y: yy,
				w: this.bounds.w*defaults.card.duel.player.attackScale.w,
				h: h
			};
			attackJSON.parentSprite = this;
			let a = new AttackDuelPlayer(attackJSON);
			animations.attack.newAttack(a);
			this.attacks.push(a);
		}

		this.lockInBtn = new ButtonLockIn({
			bounds:{
				x: this.bounds.w*defaults.card.duel.player.attackScale.x,
				y: 0,
				w: this.bounds.w*defaults.card.duel.player.attackScale.w,
				h: h
			},
			parentSprite: this
		});

	}
	loadJSON(json) {
		super.loadJSON(json);
		if(this.character !== undefined){this.character.loadJSON(json);}
	}
	draw() {
		if(this.id !== undefined) {
			push();
			this.applyAnimations();
			this.character.draw();
			this.lockInBtn.draw();
			this.attacks.forEach(function (attack) {
				attack.draw();
			});
			pop();
		}
	}
	touchEnded() {
		pushMouse();
		let didTap = super.touchEnded();
		popMouse();
	}
}