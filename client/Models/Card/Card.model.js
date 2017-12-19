class Card extends Sprite {
	constructor(json) {
		json = json === undefined ? {} : json;
		json.global = json.global === undefined ? {x:0,y:0,w:100,h:100} : json.global;
		super(json);
		this.armor = json.armor === undefined ? 1 : json.armor;
		this.health = json.health === undefined ? 1 : json.health;
		this.speed = json.speed === undefined ? 1 : json.speed;
		this.power = json.power === undefined ? 1 : json.power;
		this.currentState = 'inHand';
		this.id = json.id;
		this.attacks = [];
		this.name = json.name === undefined ? 'Adventuring_Barbarian' : json.name;
		this.loop = 'idle';
		this.loadJSON(json);
	}
	loadJSON(json) {
		if(this.id !== json.id) {
			console.log(this.constructor.name + ' is calling card swap ' + (this instanceof CardDuelCharacter));
			animations.card.swapCard(this,json);
			return false;
		} else {
			if (this.currentState !== json.currentState) {
				if (animations.card[this.currentState + '->' + json.currentState] !== undefined) {
					animations.card[this.currentState + '->' + json.currentState](this, json);
					return false;
				} else {
					console.log(this.constructor.name+' State Change '+this.currentState + '->' + json.currentState );
					this.currentState = json.currentState;
					return this.loadJSON(json);
				}
			} else {
				this.name = json.name === undefined ? 'Adventuring_Barbarian' : json.name;
				this.armor = json.armor === undefined ? 1 : json.armor;
				this.health = json.health === undefined ? 1 : json.health;
				this.speed = json.speed === undefined ? 1 : json.speed;
                this.power = json.power === undefined ? 1 : json.power;
                for(let i = 0; i < json.attacks.length; i++) {
					if(this.attacks[i] === undefined) {
						this.attacks[i] = new Attack(json.attacks[i]);
					} else {
						this.attacks[i].loadJSON(json.attacks[i]);
					}
				}
				return true;
			}
		}
	}
	hasAttack(attackID) {
		for(let i =0; i < this.attacks.length; i++) {
			if(this.attacks[i].id === attackID) {
				return true;
			}
		}
		return false;
	}

}