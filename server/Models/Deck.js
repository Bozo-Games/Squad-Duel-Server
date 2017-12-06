const generate = require('../Helpers/DataGenerator.js');
const Card = require('./Card.js');
class Deck {
	constructor() {
		this.cards = [];
		for(let i = 0; i < 50; i++) {
			this.cards.push(new Card(generate.card()));
		}
	}
	dealCard() {
		let c;
		if(this.cards.length > 0) {
			c = this.cards[0];
			this.cards.splice(0,1);
		}
		return c;
	}
	toJSON() {
		let cJSON = [];
		for(let i = 0; i < this.cards.length; i++) {
			cJSON = this.cards[i].toJSON();
		}
		return {cards:cJSON};
	}
}
module.exports = Deck;