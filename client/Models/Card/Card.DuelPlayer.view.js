class CardDuelPlayer extends Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		super(json);

		json.x = this.w*defaults.card.duel.player.characterScale.x;
		json.y = this.h*defaults.card.duel.player.characterScale.y;
		json.w = this.h*defaults.card.duel.player.characterScale.h;
		json.h = this.h*defaults.card.duel.player.characterScale.h;
		json.animation = {
			x: -json.w*2,
			y: json.y + this.bounds.y+json.h,
		};
		json.parentSprite = this;
		this.character = new CardDuelCharacter(json);

		json.x = this.w*defaults.card.duel.player.statBoxScale.x;
		json.y = this.h*defaults.card.duel.player.statBoxScale.y;
		json.w = this.w*defaults.card.duel.player.statBoxScale.w;
		json.h = this.h*defaults.card.duel.player.statBoxScale.h;
		json.animation = {
			x: -json.w-json.x,
			y: 0,
		};
		this.statsBox = new CardDuelStats(json);

		this.attacks = [];
		let h = this.h / (json.attacks.length+1); //1 for space,2 for lock in
		let spacing = h / (json.attacks.length+1);
		for(let i = 0; i < json.attacks.length; i++) {
			let attackJSON = json.attacks[i];
			let yy = spacing*(i+1) + h*(i);
			attackJSON.x = this.w*defaults.card.duel.player.attackScale.x;
			attackJSON.y = yy;
			attackJSON.w = this.w*defaults.card.duel.player.attackScale.w;
			attackJSON.h = h;
			attackJSON.animation = {
				x: this.w - (attackJSON.w-attackJSON.x ) ,
				y: 0,
			};
			attackJSON.parentSprite = this;
			let a = new AttackDuelPlayer(attackJSON);
			this.attacks.push(a);
			a.show();
		}

/*

		this.attacks = [];
		let h = this.bounds.h / (json.attacks.length+1.5); //1 for space,2 for lock in
		let spaceing = (this.bounds.h - h*(json.attacks.length+1))/2;
		for(let i = 0; i < json.attacks.length; i++) {
			let attackJSON = json.attacks[i];
			let yy = spaceing*(i+1) + h*(i+1);
			attackJSON.bounds = {
				x: this.bounds.w*defaults.card.duel.player.attackScale.x,
				y: yy,
				w: this.bounds.w*defaults.card.duel.player.attackScale.w,
				h: h
			};
			attackJSON.parentSprite = this;
			let a = new AttackDuelPlayer(attackJSON);
			a.translationAnimation.forceUpdate({x:a.bounds.w*1.2,y:0});
			animations.attack.showAttack(a,function (attack) {});
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
		this.lockInBtn.translationAnimation.forceUpdate({x:this.lockInBtn.bounds.w/2,y:h/2});
		this.lockInBtn.scaleAnimation.forceUpdate({width:0,height:0});
		animations.button.lockIn.show(this.lockInBtn);*/
	}
	hideUI() {
		this.attacks.forEach(function (attack) {
			attack.hide();
		});
		this.statsBox.hide();
	}
	showUI() {
		this.attacks.forEach(function (attack) {
			attack.show();
			animations.attack.showAttack(attack);
		});
		this.statsBox.show();
	}

	loadJSON(json) {
		let didLoad = super.loadJSON(json);
		if(didLoad) {
			if (this.character !== undefined) {
				this.character.loadJSON(json);
			}
			if(this.statsBox !== undefined) {
				this.statsBox.loadJSON(json);
			}
		}
	}
	draw() {
		if(this.id !== undefined) {
			push();
			this.applyTransformations();
			this.character.draw();
			this.statsBox.draw();
			this.attacks.forEach(function (attack) {
				attack.draw();
			});

			this.subSprites.forEach(function (sprite) {
				if(sprite instanceof FloatingText) {
					sprite.draw();
				}
			});
			if(this.debug) {this.debugDraw()}
			pop();
		}
	}
	touchEnded() {
		let didTap = super.touchEnded();
	}
}