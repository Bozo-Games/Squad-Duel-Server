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
        console.log("Attack is " + attackAttacker.category);
        if (attackAttacker.category == 'flat') {
            let s = cardDefender.health+' - ('+attackAttacker.power+' - ('+cardDefender.armor+')) = ';
            if (attackAttacker.power > cardDefender.armor) {
                cardDefender.health = cardDefender.health - (attackAttacker.power - (cardDefender.armor));
            }
            s += cardDefender.health;
            console.log(s);
        } else if (attackAttacker.category == 'pierce'){
	        let s = cardDefender.health+' - '+attackAttacker.power+' = ';
            cardDefender.health = cardDefender.health - attackAttacker.power;
	        s += cardDefender.health;
	        console.log(s);
        } else if (attackAttacker.category == 'crush' ) {
	        let s = cardDefender.armor+' - '+attackAttacker.power+' = ';
            cardDefender.armor = cardDefender.armor - attackAttacker.power;
            s += cardDefender.armor;
            console.log(s);
            if (cardDefender.armor < 0 ) {
                let rollover = cardDefender.armor;
                cardDefender.armor = 0;
	            s ='health rollover ('+cardDefender.health+' + '+rollover+' = ';
                cardDefender.health = cardDefender.health + rollover;
                s+=cardDefender.health;
                console.log(s);
            }
        }
    }

    proccessDuel() {
        console.log("new Duel Process --------------");
	    this.cardA.isVisibleToPlayer = true;
	    this.cardB.isVisibleToPlayer = true;
        let aIniative = this.cardA.speed + this.attackA.speed;
        let bIniative = this.cardB.speed + this.attackB.speed;

        if (aIniative > bIniative){
            console.log("-------------- A Attack B");
            this.resolveAttack(this.cardA, this.attackA, this.cardB, this.attackB);
	        if(this.cardB.health > 0) {
		        console.log("-------------- B Attack A");
		        this.resolveAttack(this.cardB, this.attackB, this.cardA, this.attackA);
                if(aIniative > bIniative*2) {
			        console.log("-------------- A Attack B: Bonus Attack 2x Speed");
			        this.resolveAttack(this.cardA, this.attackA, this.cardB, this.attackB);
		        } else if(aIniative > bIniative*1.5) {
                    console.log("-------------- A Attack B: Bonus Attack 1.5x Speed");
                    this.resolveAttack(this.cardA, this.attackA*.5, this.cardB, this.attackB);
                }   
	        } else {
	        	console.log("B Died");
	        }
        } else if (bIniative > aIniative) {
	        console.log("-------------- B Attack A");
            this.resolveAttack(this.cardB, this.attackB, this.cardA, this.attackA);
            if(this.cardA.health > 0) {
                console.log("-------------- A Attack B");
                this.resolveAttack(this.cardA, this.attackA, this.cardB, this.attackB);
	            if(bIniative > aIniative*2) {
		            console.log("-------------- B Attack A: Bonus Attack 2x Speed");
		            this.resolveAttack(this.cardB, this.attackB, this.cardA, this.attackA);
	            } else if(bIniative > aIniative*1.5) {
                    console.log("-------------- B Attack A: Bonus Attack 1.5x Speed");
                    this.resolveAttack(this.cardB, this.attackB*.5, this.cardA, this.attackA);
                }
	        } else {
		        console.log("A Died");
	        }
        } else {
	        console.log("Tie");
            if (Math.random() >= 0.5) {
	            console.log("-------------- A Attack B");
                this.resolveAttack(this.cardA, this.attackA, this.cardB, this.attackB);
	            if(this.cardB.health > 0) {
		            console.log("-------------- B Attack A");
		            this.resolveAttack(this.cardB, this.attackB, this.cardA, this.attackA);
	            } else {
		            console.log("B Died");
	            }
            } else {
	            console.log("-------------- B Attack A");
	            this.resolveAttack(this.cardB, this.attackB, this.cardA, this.attackA);
	            if(this.cardA.health > 0) {
		            console.log("-------------- A Attack B");
		            this.resolveAttack(this.cardA, this.attackA, this.cardB, this.attackB);
	            } else {
		            console.log("A Died");
	            }
            }
        }

        let r = {};
	    if (this.cardA.health > 0 ){
	        console.log("Card A has Survived!");
	    	r.A = this.cardA;
	    }
	    if(this.cardB.health > 0) {
		    console.log("Card B has Survived!");
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