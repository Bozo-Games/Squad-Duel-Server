"use strict";
const E = require('../../client/duel/Helpers/Enums.js');
const logs = require('../Helpers/logger.js');
const StateMachine = require('javascript-state-machine');
const Card = require('./Card.js');
const Attack = require('./Attack.js');
class Duel {
    constructor(json) {
        json = json === undefined ? {} : json;
	    this._stateMachine = new StateMachine({
		    data: {
			    cardA: json.cardA === undefined ? undefined : new Card(json.cardA),
			    cardB: json.cardB === undefined ? undefined : new Card(json.cardB),
			    attackA: json.cardA === undefined ? undefined : new Attack(json.attackA),
			    attackB: json.cardB === undefined ? undefined : new Attack(json.attackB)
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
		    	onBeforeAddCard:    this._onBeforeAddCard,
			    onBeforeAddAttack:  this._onBeforeAddAttack,
			    //All state changes globally
			    onBeforeTransition: this._onBeforeTransition,
			    onAfterTransition:  this._onAfterTransition,
			    onEnterState:       this._onEnterState,
			    onLeaveState:       this._onLeaveState
		    }
	    });
    }
	//------------------------------------------------- -------------------------------------------------------- Getters
	get cardA() {
    	return this._stateMachine.cardA;
	}
	get cardB() {
    	return this._stateMachine.cardB;
	}
	get attackA() {
    	return this._stateMachine.attackA;
	}
	get attackB() {
    	return this._stateMachine.attackB;
	}
	get currentSate() {
    	return this._stateMachine.state;
	}
	//------------------------------------------------- -------------------------------------------------------- Setters

	//----------------------------------------------------- -------------------------------- public State Machine Events
	addCard(card,letter) {
    	if(card !== undefined) {
    		if(card.id !== undefined && (letter === 'A' || letter === 'B')) {
			    return this._stateMachine.addCard(card,letter);
		    }
	    }
	    return false;
	}
	addAttack(attackID,letter) {
    	if(attackID !== undefined && (letter === 'A' || letter === 'B') ) {
    		let attack = this['card'+letter].getAttackByID(attackID);
    		if(attack !== undefined) {
			    return this._stateMachine.addAttack(attack,letter);
		    }
	    }
    	return false;
	}
	//----------------------------------------------------- --------------------------------------------- public methods
    toJSON(){
        return {
            cardA:this._stateMachine.cardA === undefined ? undefined : this._stateMachine.cardA.toJSON(),
            cardB:this._stateMachine.cardB === undefined ? undefined : this._stateMachine.cardB.toJSON(),
			currentState:this._stateMachine.state,
            attackA:this._stateMachine.attackA === undefined ? undefined : this._stateMachine.attackA.toJSON(),
            attackB:this._stateMachine.attackB === undefined ? undefined : this._stateMachine.attackB.toJSON()
        };
    }
	//------------------------------------------------- -------------------------------------------------- state machine
	_onBeforeAddCard(lifecycle,card,letter) {
    	logs.log(E.logs.duel,"card " + card.id + " is selected by player "+ letter);
		this['card'+letter] = card;
		card.selectCard();
		return (this.cardA !== undefined && this.cardB !== undefined);
	}
	_onBeforeAddAttack(lifecycle,attack,letter) {
		logs.log(E.logs.duel,'attack '+letter +' selected '+ attack.id);
		this['attack'+letter] = attack;
		return (this.attackA !== undefined && this.attackB !== undefined);
	}
	//------------------------------------------------- ------------------------------------------------ All transitions
	_onBeforeTransition(lifecycle) {
		logs.log(E.logs.duel,'~~~~~~~~~~~~~~~~ NEW DUEL STATE CHANGE ~~~~~~~~~~~~~~~~ ');
		logs.log(E.logs.duel, "On BEFORE transition - " + lifecycle.transition +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	_onAfterTransition(lifecycle) {
		logs.log(E.logs.duel, "On AFTER transition  - " + lifecycle.transition +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	_onEnterState(lifecycle) {
		logs.log(E.logs.duel, "On ENTER state       - " + lifecycle.to +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	_onLeaveState(lifecycle) {
		logs.log(E.logs.duel, "On LEAVE state       - " + lifecycle.from +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
}
module.exports = Duel;