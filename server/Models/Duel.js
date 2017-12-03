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
	    let flatDamage = Math.floor(this.attackB.flat / (this.cardA.armor+1));
	    let crushingDamage = Math.min(this.attackB.crushing,this.cardA.armor);
	    this.cardA.armor -= crushingDamage;
	    this.cardA.health -= (this.attackB.piercing + flatDamage + crushingDamage);

	    flatDamage = Math.floor(this.attackA.flat / (this.cardB.armor+1));
	    crushingDamage = Math.min(this.attackA.crushing,this.cardB.armor);
	    this.cardB.armor -= crushingDamage;
	    this.cardB.health -= (this.attackA.piercing + flatDamage + crushingDamage);

	    console.log(this.cardA.toJSON());
	    console.log(this.cardB.toJSON());
    	//clean up and return results
		let r = {
			A:new Card(this.cardA.toJSON()),
			B:new Card(this.cardB.toJSON())
		};
	    this.cardA = undefined;
	    this.attackA = undefined;
	    this.cardB = undefined;
	    this.attackB = undefined;
        return r;
    }

}
module.exports = Duel;