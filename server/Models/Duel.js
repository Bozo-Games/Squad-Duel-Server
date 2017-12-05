"use strict";
const E = require('../../client/duel/Helpers/Enums.js');
const logs = require('../Helpers/logger.js');
const Card = require('./Card.js');
const StateMachine = require('javascript-state-machine');
const Attack = require('./Attack.js');
class Duel {
    constructor(json) {
        json = json === undefined ? {} : json;

	    this._stateMachine = new StateMachine({
		    data: {
		    	cardA:undefined,
			    cardB:undefined,
			    attackA: undefined,
			    attackB: undefined
		    },
		    init:'waitingForCards',
		    transitions: [
			    {name:'addCard', from:'waitingForCards', to:'waitingForAttacks'},
			    {name:'addAttack', from:'waitingForAttacks', to:'ready'},
			    {name:'processDuel', from:'ready', to:'initiative'},
			    {name:'nextAttack', from:'initiative', to:'A->B'},
			    {name:'nextAttack', from:'initiative', to:'B->A'},
			    {name:'nextAttack', from:'B->A', to:'A->B'},
			    {name:'nextAttack', from:'A->B', to:'B->A'},
			    {name:'nextAttack', from:'A->B', to:'displayResults'},
			    {name:'nextAttack', from:'B->A', to:'displayResults'},
			    {name:'acceptResults', from:'displayResults', to:'waitingForCards'},
		    ],
		    methods: {
			    //All state changes globaly
			    onBeforeTransition: this.onBeforeTransition,
			    onAfterTransition: this.onAfterTransition,
			    onEnterState: this.onEnterState,
			    onLeaveState: this.onLeaveState
		    }
	    });

        this.cardA = json.cardA === undefined ? undefined : new Card(json.cardA);
        this.cardB = json.cardB === undefined ? undefined : new card(json.cardB);

        this.attackA = json.attackA === undefined ? undefined : new Attack(json.attackA);
        this.attackB = json.attackB === undefined ? undefined : new Attack(json.attackB);
    }
    toJSON(){
        return {
            cardA:this.cardA === undefined ? undefined : this.cardA.toJSON(),
            cardB:this.cardB === undefined ? undefined : this.cardB.toJSON(),
			currentState:this._stateMachine.state,
            attackA:this.attackA === undefined ? undefined :this.attackA.toJSON(),
            attackB:this.attackB === undefined ? undefined :this.attackB.toJSON()
        };
    }

	//All transitions
	onBeforeTransition(lifecycle) {
		logs.log(E.logs.gameStateMachine, "On BEFORE transition - " + lifecycle.transition +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	onAfterTransition(lifecycle) {
		logs.log(E.logs.gameStateMachine, "On AFTER transition  - " + lifecycle.transition +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	onEnterState(lifecycle) {
		logs.log(E.logs.gameStateMachine, "On ENTER state       - " + lifecycle.to +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	onLeaveState(lifecycle) {
		logs.log(E.logs.gameStateMachine,"---------------------\n");
		logs.log(E.logs.gameStateMachine, "On LEAVE state       - " + lifecycle.from +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	/*
    resolveAttack(cardAttacker,attackAttacker,cardDefender,attackDefender) {
        console.log("Attack is " + attackAttacker.category);
        if (attackAttacker.category == 'flat') {
            let s = cardDefender.health+' - ('+attackAttacker.power+' - ('+cardDefender.armor+')) = ';
            cardDefender.health = cardDefender.health - (attackAttacker.power - (cardDefender.armor));
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
	        } else {
	        	console.log("B had Died");
	        }
        } else if (bIniative > aIniative) {
	        console.log("-------------- B Attack A");
            this.resolveAttack(this.cardB, this.attackB, this.cardA, this.attackA);
	        console.log("-------------- A Attack B");
	        if(this.cardA.health > 0) {
                this.resolveAttack(this.cardA, this.attackA, this.cardB, this.attackB);
	        } else {
		        console.log("A had Died");
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
		            console.log("B had Died");
	            }
            } else {
	            console.log("-------------- B Attack A");
	            this.resolveAttack(this.cardB, this.attackB, this.cardA, this.attackA);
	            if(this.cardA.health > 0) {
		            console.log("-------------- A Attack B");
		            this.resolveAttack(this.cardA, this.attackA, this.cardB, this.attackB);
	            } else {
		            console.log("A had Died");
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
*/
}
module.exports = Duel;