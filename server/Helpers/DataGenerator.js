"use strict";
const attackDB = require('../Data/Attack.js');
const cardDB = require('../Data/Card.js');
const defaults = require('./defualts.js');
const Generator = {
    attack: function () {
        let keys = Object.keys(attackDB);
        let key = keys[Math.floor(Math.random()*keys.length)];
        let json = JSON.parse(JSON.stringify(attackDB[key]));
        json.id = Generator.guid();
        return json;
    },
    card: function () {
        let keys = Object.keys(cardDB)
        let key = keys[Math.floor(Math.random()*keys.length)];
        let json = JSON.parse(JSON.stringify(cardDB[key]));
        json.id = Generator.guid();
        return json;
    },
    hand: function () {
        let cardsJSON = [];
        while (cardsJSON.length < defaults.hand.numberOfCards) {
            cardsJSON.push(Generator.card())
        }
        return {cards:cardsJSON};
    },
    guid: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4();
    }
};

module.exports = Generator;