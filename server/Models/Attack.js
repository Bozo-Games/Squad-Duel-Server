"use strict";
const generate = require('../Helpers/DataGenerator.js');
class Attack {
    constructor(json) {
        json = json === undefined ? generate.attack() : json;
        this.id = json.id === undefined ? -1 : json.id;
        this.flat = json.flat === undefined ? 0 : json.flat;
        this.crushing = json.crushing === undefined ? 0 : json.crushing;
        this.piercing = json.piercing === undefined ? 0 : json.piercing;
        this.defense = json.defense === undefined ? 0 : json.defense;
        this.speed = json.speed === undefined ? 0 : json.speed;
        this.power = json.power === undefined ? 0 : json.power;
        this.attackName = json.attackName === undefined ? 'unknown' : json.attackName;
    }

    toJSON(){
        return {
            id: this.id,
            flat:this.flat,
            crushing:this.crushing,
            piercing:this.piercing,
            defense:this.defense,
            speed:this.speed,
            power:this.power,
            attackName:this.attackName,
        };
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
}
module.exports = Attack;