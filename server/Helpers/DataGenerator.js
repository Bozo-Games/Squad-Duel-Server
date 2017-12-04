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
/*      let keys = Object.keys(attackDB);
        let key = keys[Math.floor(Math.random()*keys.length)];
        let json = JSON.parse(JSON.stringify(attackDB[key])); */

        let attackNames = Object.keys(attackDB);
        let attackName = Math.floor(Math.random()*attackNames.length);
        let json = JSON.parse(JSON.stringify(attackDB[attackName]));
       // console.log(attackDB);

        let json = {
            name: json.attackName,
            type: json.type,
            power: json.power,
            speed: json.speed,
        };
       
        json.name = attackJson.name;
        json.id = Generator.guid();
        return json;
    },
    card: function () {
        //console.log(cardDB);
        let classNames = Object.keys(cardDB.characterClasses);
        let className = Math.floor(Math.random()*classNames.length);
        let classJson = cardDB.characterClasses[classNames[className]];
        console.log('class json - ' + classJson);

        let titleNames = Object.keys(cardDB.characterTitles);
        console.log(titleNames);
        let titleName = Math.floor(Math.random()*titleNames.length);
        let titleJson = cardDB.characterTitles[titleNames[titleName]];

        let json ={
            name:  titleNames[titleName]+ ' '+ classNames[className],
            health: classJson.health + titleJson.health,
            armor: classJson.armor + titleJson.armor,
            speed: classJson.speed + titleJson.speed,
            icon: Math.floor(Math.random() * 53)

        };
        json.id = Generator.guid();
        console.log(json);
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