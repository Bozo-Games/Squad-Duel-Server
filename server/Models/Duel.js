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

    resolveAttack(cardAttacker,attackAttacker,cardDefender,attackDefender) {
        if (attackAttacker.category == 'flat') {
            cardDefender.health = cardDefender.health - (attackAttacker.power - (cardDefender.armor+attackDefender.armor));  
        } else if (attackAttacker.category == 'pierce'){
            cardDefender.health = cardDefender.health - attackAttacker.power;
        } else if (attackAttacker.category == 'crush' ) {
            cardDefender.armor = cardDefender.armor - attackAttacker.power;
            if (cardDefender.armor < 0 ) {
                let rollover = cardDefender.armor;
                cardDefender.armor = 0;
                cardDefender.health = cardDefender.health + rollover;
            }
        }
    }

    proccessDuel() {
	    this.cardA.isVisibleToPlayer = true;
	    this.cardB.isVisibleToPlayer = true;
        let aIniative = this.cardA.speed + this.attackA.speed;
        let bIniative = this.cardB.speed + this.attackB.speed;

        if (aIniative > bIniative){
            if (aIniative > bIniative*2) {
                this.resolveAttack(this.cardA, this.attackA, this.cardB, this.attackB);
                this.resolveAttack(this.cardB, this.attackB, this.cardA, this.attackA);
                this.resolveAttack(this.cardA, this.attackA, this.cardB, this.attackB);
            } else {
                this.resolveAttack(this.cardA, this.attackA, this.cardB, this.attackB);
                this.resolveAttack(this.cardB, this.attackB, this.cardA, this.attackA);
            }
        } else if (bIniative > aIniative) {
            if (bIniative > aIniative*2) {
                this.resolveAttack(this.cardB, this.attackB, this.cardA, this.attackA);
                this.resolveAttack(this.cardA, this.attackA, this.cardB, this.attackB);
                this.resolveAttack(this.cardB, this.attackB, this.cardA, this.attackA);
            } else {
                this.resolveAttack(this.cardB, this.attackB, this.cardA, this.attackA);
                this.resolveAttack(this.cardA, this.attackA, this.cardB, this.attackB);
            }
        } else {
            let coin = random(0,1);
            if (coin == 0) {
                this.resolveAttack(this.cardA, this.attackA, this.cardB, this.attackB);
                this.resolveAttack(this.cardB, this.attackB, this.cardA, this.attackA);
            } else {
                this.resolveAttack(this.cardB, this.attackB, this.cardA, this.attackA);
                this.resolveAttack(this.cardA, this.attackA, this.cardB, this.attackB);
            }
        }

        let r = {};
	    if (this.cardA.health > 0 ){
	    	r.A = this.cardA;
	    }
	    if(this.cardB.health > 0) {
	    	r.B = this.cardB;
	    }
	    this.cardA = undefined;
	    this.attackA = undefined;
	    this.cardB = undefined;
	    this.attackB = undefined;

        return r;
    }

}
module.exports = Duel;