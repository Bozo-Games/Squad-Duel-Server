"use strict";
const attackDB = require('../Data/Attack.js');
const cardDB = require('../Data/Card.js');
const defaults = require('../../client/duel/Helpers/defaults.js');
function random(choices) {
    return choices[Math.floor(Math.random()*choices.length)];
}
let tsl = (new Date()).getTime(); //time since launch
const Generator = {
    attack: function () {
        let attackNames = Object.keys(attackDB);
        let attackName = Math.floor(Math.random()*attackNames.length);
        let json = JSON.parse(JSON.stringify(attackDB[attackNames[attackName]]));
        json.name = attackNames[attackName];
        json.id = Generator.guid();
        return json;
    },
    card: function () {
        let classNames = Object.keys(cardDB.characterClasses);
        let className = Math.floor(Math.random()*classNames.length);
        let classJson = cardDB.characterClasses[classNames[className]];

        let titleNames = Object.keys(cardDB.characterTitles);
        let titleName = Math.floor(Math.random()*titleNames.length);
        let titleJson = cardDB.characterTitles[titleNames[titleName]];

        let json = {
            name:  titleNames[titleName]+ ' '+ classNames[className],
            health: classJson.health + titleJson.health,
            armor: classJson.armor + titleJson.armor,
            speed: classJson.speed + titleJson.speed,
            icon: Math.floor(Math.random() * 53)

        };
        if (json.armor < 0) {
            let negativeArmor = json.armor;
            json.armor = 0;
            json.heatlh = json.health - negativeArmor*2;
        }
        if (json.speed < 0) {
            let negativeSpeed = json.speed;
            json.speed = 0;
            json.health = json.health - negativeSpeed*2;
        }
        json.id = Generator.guid();
        return json;
    },
    hand: function () {
        let cardsJSON = [];
        while (cardsJSON.length < defaults.server.hand.numberOfCards) {
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