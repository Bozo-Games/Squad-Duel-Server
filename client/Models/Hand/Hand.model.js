class Hand extends Sprite{
	constructor(json){
		super(json);
		json = json === undefined ? {} : json;
		this.cards = json.cards === undefined ? [] : json.cards;
		this.cards = [];
		json.cards = json.cards === undefined ? [] : json.cards;
		for(let i = 0; i < json.cards.length;i++) {
			this.cards.push(new CardInHand(json.cards[i]));
			this.addSubSprite(this.cards[i]);
		}
	}
	loadJSON(json) {
		console.log('loading new Hand')
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
		let w = this.bounds.w/(this.cards.length+0.5);
		for(let i = 0; i < this.cards.length;i++) {
			this.cards[i].bounds = {
				x: (i+1)*(this.bounds.w-w*this.cards.length)/(this.cards.length +1) + w*i,
				y: 0,
				w:w,
				h:w
			};
			console.log('card bounds set to ' + JSON.stringify(this.cards[i].bounds));
		}
	}
	touchEnded(){
		pushMouse();
		let didTap = super.touchEnded();
		if(didTap) {
			this.fillColor = '#00ff00';
		} else {
			this.fillColor = '#ff0000';
		}
		popMouse();
	}
	draw() {
		push();
		this.applyAnimations();

		this.drawSubViews();
		pop();
	}
}