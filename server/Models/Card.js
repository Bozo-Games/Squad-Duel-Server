"use strict";
const generate = require('../Helpers/DataGenerator.js');
const defualts = require('../Helpers/defualts.js');
const Attack = require('./Attack.js');
class Card {
    constructor(json) {
        json = json === undefined ? generate.card() : json;
        this.id = json.id === undefined ? -1 : json.id;
        this.health = json.health === undefined ? 0 : json.health;
        this.armor = json.armor === undefined ? 0 : json.armor;
        this.speed = json.speed === undefined ? 0 : json.speed;
        json.attacks = json.attacks === undefined ? [] : json.attacks;
        this.attacks = [];
        for(let i = 0; i < json.attacks; i++) {
            this.attacks.push(new Attack(json.attacks[i]));
        }
        while(this.attacks.length < defualts.card.numberOfAttacks) {
            this.attacks.push(new Attack());
        }
    }
    toJSON(){
        let attacksJSON = [];
        for(let i = 0; i < this.attacks.length; i++) {
            attacksJSON.push(this.attacks[i].toJSON());
        }
        return {
            id:this.id,
            health:this.health,
            armor:this.armor,
            speed:this.speed,
            attacks:attacksJSON
        };
    }
    toString(){
        let attacksStrings = '[';
        for(let i = 0; i < this.attacks.length; i++) {
            attacksStrings += this.attacks[i].toString() + ',';
        }
        attacksStrings += ']';
        return "{\n"+
            "\tid: "+this.id+"\n"+
            "\thealth:"+this.health+"\n"+
            "\tarmor:"+this.armor+"\n"+
            "\tspeed:"+this.speed+"\n"+
            "\tattacks:"+attacksStrings+"\n}";
    }
}
module.exports = Card;