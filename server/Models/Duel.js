"use strict";
const Card = require('./Card.js');
const Attack = require('./Attack.js');
const E = require('../../client/duel/Helpers/Enums.js');
class Duel {
    constructor(json) {
        json = json === undefined ? {} : json;
        this.cardA = json.cardA === undefined ? undefined : new Card(json.cardA);
        this.cardB = json.cardB === undefined ? undefined : new card(json.cardB);

        this.attackA = json.attackA === undefined ? undefined : new Attack(json.attackA);
        this.attackB = json.attackB === undefined ? undefined : new Attack(json.attackB);
    }
    toJSON(){
        return {
            cardA:this.cardA === undefined ? undefined : this.cardA.toJSON(),
            cardB:this.cardB === undefined ? undefined : this.cardB.toJSON(),

            attackA:this.attackA === undefined ? undefined :this.attackA.toJSON(),
            attackB:this.attackB === undefined ? undefined :this.attackB.toJSON()
        };
    }
    toString() {
        const ca = this.cardA === undefined ? 'undefined' : this.cardA.toString();
        const cb = this.cardB === undefined ? 'undefined' : this.cardB.toString();
        const aa = this.attackA === undefined ? 'undefined' : this.attackA.toString();
        const ab = this.attackB === undefined ? 'undefined' : this.attackB.toString();
        return "{cardA: "+ca+",\n"+
            "attackA:"+aa+",\n"+
            "cardB:"+cb+",\n"+
            "attackB:"+ab+",\n}";
    }
    proccessDuel() {
        return {status:E.Status.success};
    }

}
module.exports = Duel;