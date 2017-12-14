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


		json.bounds = {
			x: this.bounds.w*defaults.card.duel.player.statBoxScale.x,
			y: this.bounds.h*defaults.card.duel.player.statBoxScale.y,
			w: this.bounds.h*defaults.card.duel.player.statBoxScale.h,
			h: this.bounds.h*defaults.card.duel.player.statBoxScale.h
		};
		this.statsBox = new CardDuelStats(json);
		this.statsBox.translationAnimation.forceUpdate({
			x:-this.statsBox.bounds.w*1.3,
			y:this.statsBox.translationAnimation.y});
		animations.card.showStatBox(this.statsBox);

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
		this.lockInBtn.scaleAnimation.forceUpdate({width:0,height:0});
		this.lockInBtn.translationAnimation.forceUpdate({x:(this.bounds.w*defaults.card.duel.player.attackScale.x)*1.5,y:h});
		animations.button.lockIn.show(this.lockInBtn);

	}
	hideUI() {
		this.attacks.forEach(function (attack) {
			animations.attack.hideAttack(attack);
		});
		animations.card.hideStatBox(this.statsBox);
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
			this.statsBox.draw();
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