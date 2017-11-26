"use strict";
const generate = require('../Helpers/DataGenerator.js');
const defualts = require('../Helpers/defualts.js');
const Card = require('./Card.js');

class Hand {
    constructor(json) {
        json = json === undefined ? {cards: []} : json;
        this.cards = [];
        for(let i = 0; i < json.cards; i++) {
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
}
module.exports = Hand;