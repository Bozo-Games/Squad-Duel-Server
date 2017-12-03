"use strict";
const attackDB = require('../Data/Attack.js');
const cardDB = require('../Data/Card.js');
const defaults = require('./defualts.js');
function random(choices) {
    return choices[Math.floor(Math.random()*choices.length)];
}
let tsl = (new Date()).getTime(); //time since launch
const Generator = {
    attack: function () {
        /*
        let keys = Object.keys(attackDB);
        let key = keys[Math.floor(Math.random()*keys.length)];
        let json = JSON.parse(JSON.stringify(attackDB[key]));*/
        let json = {
            name: "Attack " + ((new Date()).getTime()-tsl).toString(),
            flat: random([0,1,2,3,4]),
	        piercing: random([0,1,2]),
	        crushing: random([0,1,2]),
        };
        json.defense = 8 - (json.flat +json.piercing+json.crushing);
        json.name = "F-"+json.flat+"P-"+json.piercing+"C-"+json.crushing+"D-"+json.defense;
        json.id = Generator.guid();
        return json;
    },
    card: function () {
        /*
        let keys = Object.keys(cardDB)
        let key = keys[Math.floor(Math.random()*keys.length)];*/

        let json ={
            name: "Card " + ((new Date()).getTime()-tsl).toString(),
            health: random([5,5,5,6,6,7]),
            armor: random([0,1,2]),
            speed: random([0,1,2])
        };
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