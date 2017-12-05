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
        this.icon = json.icon === undefined ? 0 : json.icon;
	    this.name = json.name === undefined ? 'Card -1' : json.name;
        json.attacks = json.attacks === undefined ? [] : json.attacks;

	    this.isVisibleToPlayer = json.isVisibleToPlayer === undefined ? false : json.isVisibleToPlayer;

        this.attacks = [];

        for (let i = 0; i < json.attacks.length; i++) {
            this.attacks.push(new Attack(json.attacks[i]));
        }

        while(this.attacks.length < defualts.card.numberOfAttacks) {
            let newAttack = new Attack();
            let match = false;
            for (let i = 0; i < this.attacks.length; i++) {
                if (this.attacks[i].category == newAttack.category) {
                    match = true;
                } 
            }
            if (match == false) { 
                this.attacks.push(newAttack);  
            }
            
        }
        console.log(json);
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
            icon:this.icon,
            name:this.name,
            attacks:attacksJSON,
            isVisibleToPlayer:this.isVisibleToPlayer
        };
    }
}
module.exports = Card;