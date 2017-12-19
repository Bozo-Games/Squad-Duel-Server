
const defaults = require('../Helpers/defaults.js');
const Card = require('./Card.js');
class Hand {
    constructor(json) {
        json = json === undefined ? {cards: []} : json;
        this.cards = [];
        for(let i = 0; i < json.cards.length; i++) {
            this.cards.push(new Card(json.cards[i]));
        }
    }
    toJSON(){
        let cardsJSON = [];
        for(let i = 0; i < this.cards.length; i++) {
            cardsJSON.push(this.cards[i].toJSON());
        }
        return {
            cards:cardsJSON
        };
    }
    //------------------------------------------------------------------- public methods
    getCardByID(cardID) {
	    for(let i = 0; i < this.cards.length; i++) {
		    if(this.cards[i].id === cardID) {return this.cards[i];}
	    }
	    return undefined;
    }
}
module.exports = Hand;