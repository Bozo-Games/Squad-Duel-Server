class Hand extends Sprite{
	constructor(json){
		json = json === undefined ? {} : json;
		json.fillColor = '#817283';
		super(json);
		this.cards = json.cards === undefined ? [] : json.cards;
		this.cards = [];
		json.cards = json.cards === undefined ? [] : json.cards;
		for(let i = 0; i < json.cards.length;i++) {
			this.cards.push(new CardInHand(json.cards[i]));
			this.addSubSprite(this.cards[i]);
		}
	}
	loadJSON(json) {
		json.cards = json.cards === undefined ? [] : json.cards;
		for(let i = 0; i < json.cards.length;i++) {
			if(this.cards[i] === undefined) {
				this.cards.push(new CardInHand(json.cards[i]));
				this.addSubSprite(this.cards[i]);
			} else {
				this.cards[i].loadJSON(json.cards[i]);
			}
		}
		this._resizeCards();
	}
	_resizeCards() {
		let w = this.w/(this.cards.length+0.5);
		for(let i = 0; i < this.cards.length;i++) {
			this.cards[i].root.x = (i+1)*(this.w-w*this.cards.length)/(this.cards.length +1) + w*i;
			this.cards[i].root.y = 0;
			this.cards[i].root.w = w;
			this.cards[i].root.h = w;
		}
	}
	draw() {
		push();
		this.applyTransformations();
		this.drawSubSprites();
		pop();
	}
}