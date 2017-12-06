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
			    cardA: json.cardA === undefined ? undefined : json.cardA,
			    cardB: json.cardB === undefined ? undefined : json.cardB,
			    attackA: json.cardA === undefined ? undefined : json.attackA,
			    attackB: json.cardB === undefined ? undefined : json.attackB
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
	//------------------------------------------------- -------------------------------------------------------- Setters

	//----------------------------------------------------- -------------------------------- public State Machine Events

	//----------------------------------------------------- --------------------------------------------- public methods
    toJSON(){
        return {
            cardA:this.cardA === undefined ? undefined : this.cardA.toJSON(),
            cardB:this.cardB === undefined ? undefined : this.cardB.toJSON(),
			currentState:this._stateMachine.state,
            attackA:this.attackA === undefined ? undefined : this.attackA.toJSON(),
            attackB:this.attackB === undefined ? undefined : this.attackB.toJSON()
        };
    }
	//------------------------------------------------- -------------------------------------------------- state machine
	//------------------------------------------------- ------------------------------------------------ All transitions
	onBeforeTransition(lifecycle) {
		logs.log(E.logs.duelStateMachine, "On BEFORE transition - " + lifecycle.transition +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	onAfterTransition(lifecycle) {
		logs.log(E.logs.duelStateMachine, "On AFTER transition  - " + lifecycle.transition +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	onEnterState(lifecycle) {
		logs.log(E.logs.duelStateMachine, "On ENTER state       - " + lifecycle.to +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	onLeaveState(lifecycle) {
		logs.log(E.logs.duelStateMachine,"---------------------\n");
		logs.log(E.logs.duelStateMachine, "On LEAVE state       - " + lifecycle.from +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
}
module.exports = Duel;