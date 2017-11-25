"use strict";
const Player = require('./Player.js');
class Attack {
    constructor(json) {
        json = json === undefined ? {} : json;
        this.id = json.id === undefined ? 0 : json.id;
        this.flat = json.flat === undefined ? 0 : json.flat;
        this.crushing = json.crushing === undefined ? 0 : json.crushing;
        this.piercing = json.piercing === undefined ? 0 : json.piercing;
        this.defense = json.defense === undefined ? 0 : json.defense;
        this.speed = json.speed === undefined ? 0 : json.speed;
        this.power = json.power === undefined ? 0 : json.power;
    }

    toJSON(){
        return {
            id: this.id,
            flat:this.flat,
            crushing:this.crushing,
            piercing:this.piercing,
            defense:this.defense,
            speed:this.speed,
            power:this.power
        };
    }
}
let attackDB = [
    new Attack({id: 0, flat: 0,    crushing: 0,    piercing: 0,    defense: 0, speed:0,    power:0}),
    new Attack({id: 1, flat: 0,    crushing: 1,    piercing: 0,    defense: 0, speed:0,    power:0}),
];
module.exports = attackDB;
module.exports = Attack;