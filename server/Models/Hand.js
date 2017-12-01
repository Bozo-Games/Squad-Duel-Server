"use strict";
const generate = require('../Helpers/DataGenerator.js');
const defualts = require('../Helpers/defualts.js');
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
        console.log('------');
        for(let i = 0; i < this.cards.length; i++) {
            console.log('pushing - '+i+' - '+this.cards[i].id);
            cardsJSON.push(this.cards[i].toJSON());
        }
        return {
            cards:cardsJSON
        };
    }
    toString(){

        let cardsString= '{cards:[';
        for(let i = 0; i < this.cards.length; i++) {
            cardsString += this.cards[i].toString() +', \n';
        }
        cardsString += '}';
        return cardsString;
    }
}
module.exports = Hand;