class CardDuelOpp extends  Card {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.touchEnabled = false;
		super(json);


		json.x = this.w*defaults.card.duel.opp.characterScale.x;
		json.y = this.h*defaults.card.duel.opp.characterScale.y;
		json.w = this.h*defaults.card.duel.opp.characterScale.h;
		json.h = this.h*defaults.card.duel.opp.characterScale.h;
		json.animation = {
			x: json.w*2,
			y: json.y - this.bounds.y-json.h,
			w:-1
		};
		json.parentSprite = this;
		this.character = new CardDuelCharacter(json);


		json.x = this.w*defaults.card.duel.opp.statBoxScale.x;
		json.y = this.h*defaults.card.duel.opp.statBoxScale.y;
		json.w = this.w*defaults.card.duel.opp.statBoxScale.w;
		json.h = this.h*defaults.card.duel.opp.statBoxScale.h;
		json.animation = {
			x: (this.w+json.w)-json.x,
			y: 0,
		};
		this.statsBox = new CardDuelStats(json);

		this.attacks = [];
		let h = this.h / (json.attacks.length+1); //1 for space,2 for lock in
		let spacing = h / (json.attacks.length+1);
		for(let i = 0; i < json.attacks.length; i++) {
			let attackJSON = json.attacks[i];
			let yy = spacing*(i+1) + h*(i);
			attackJSON.x = this.w*defaults.card.duel.opp.attackScale.x;
			attackJSON.y = yy;
			attackJSON.w = this.w*defaults.card.duel.opp.attackScale.w;
			attackJSON.h = h;
			attackJSON.animation = {
				x: -attackJSON.x - attackJSON.w,
				y: 0,
			};
			attackJSON.parentSprite = this;
			let a = new AttackDuelPlayer(attackJSON);
			this.attacks.push(a);
			//a.show();
		}

		this.character.debug = true;
	}
	show() {
		this.character.loop = 'walk';
		this.character.moveToLocal(this.character.w,0,function (card) {
			card.loop = 'idle';
		},800);
		for(let attack of this.attacks) {
			attack.show();
		}
		this.statsBox.show();

		//animations.card.oppCharacterEnters(this.character,function (card) {});
	}

	draw() {
		if(this.id !== undefined) {
			push();
			this.applyTransformations();
			this.character.draw();
			this.statsBox.draw();
			//this.lockInBtn.draw();

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
}