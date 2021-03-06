"use strict";
const generate = require('../Helpers/DataGenerator.js');
class Attack {
    constructor(json) {
        json = json === undefined ? generate.attack() : json;
        this.id = json.id === undefined ? -1 : json.id;
        this.category = json.category === undefined ? 'unknown' : json.category;
        this.power = json.power === undefined ? 0 : json.power;
	    this.speed = json.speed === undefined ? 0 : json.speed;
        this.name = json.name === undefined ? 'unknown' : json.name;
    }

    toJSON(){
        return {
            id: this.id,
            category: this.category,
            power: this.power,
            speed: this.speed,
            name: this.name,
        };
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
}
module.exports = Attack;