"use strict";
const E = require('../../client/duel/Helpers/Enums.js');
const defualts = require('../../client/duel/Helpers/defaults.js');
const Attack = require('./Attack.js');
const StateMachine = require('javascript-state-machine');
const logs = require('../Helpers/logger.js');
class Card {
    constructor(json) {
        json = json === undefined ? {} : json;
	    this._stateMachine = new StateMachine({
		    data: {
			    id: json.id === undefined ? -1 : json.id,
			    name: json.name === undefined ? 'No Name' : json.name,
			    health:  json.health === undefined ? 0 : json.health,
			    armor: json.armor === undefined ? 0 : json.armor,
			    speed: json.speed === undefined ? 0 : json.speed,
			    icon: json.icon === undefined ? 0 : json.icon,
			    attacks: []
		    },
		    init:'inDeck',
		    transitions: [
			    {name:'dealToPlayer', from:'inDeck', to:'inHand'},

			    {name:'selectCard', from:'inHand', to:'selected'},

			    {name:'returnToHand',from:['selected','dueling'], to:'inHand'},

			    {name:'confirm',from:'selected', to:'lockedIn'},

			    {name:'duel', from:'lockedIn', to:'dueling'},

			    {name:'kill', from:'dueling', to:'dead'}
		    ],
		    methods: {
			    //All state changes globaly
			    onBeforeTransition: this._onBeforeTransition,
			    onAfterTransition: this._onAfterTransition,
			    onEnterState: this._onEnterState,
			    onLeaveState: this._onLeaveState
		    }
	    });
	    json.attacks = json.attacks === undefined ?  [] : json.attacks;
        for(let i = 0; i < json.attacks.length; i++) {
            this._stateMachine.attacks.push(new Attack(json.attacks[i]));
        }
        while(this._stateMachine.attacks.length < defualts.server.card.numberOfAttacks) {
            this._stateMachine.attacks.push(new Attack());
        }
    }
    //------------------------------------------------- -------------------------------------------------------- Getters
	get id() {
    	return this._stateMachine.id;
	}
	get name() {
    	return this._stateMachine.name;
	}
	get health() {
    	return this._stateMachine.health;
	}
	get armor() {
    	return this._stateMachine.armor;
	}
	get speed() {
    	return this._stateMachine.speed;
	}
	get icon() {
    	return this._stateMachine.icon;
	}
	get attacks() {
    	return this._stateMachine.attacks;
	}
	get currentState() {
    	return this._stateMachine.state;
	}
	get canSelect(){
    	return this._stateMachine.can('selectCard');
	}
	//------------------------------------------------- -------------------------------------------------------- Setters
	set armor(newArmor) {
    	this._stateMachine.armor = Math.max(0,newArmor);
	}
	set health(newHealth){
		this._stateMachine.health = Math.max(0,newHealth);
		if(this.health <=0) {
			this.kill();
		}
	}
	//----------------------------------------------------- -------------------------------- public State Machine Events
	dealToPlayer() {
		return this._stateMachine.dealToPlayer();
	}
	selectCard() {
		return this._stateMachine.selectCard();
	}
	returnToHand() {
		return this._stateMachine.returnToHand();
	}
	confirm(){
    	return this._stateMachine.confirm();
	}
	duel() {
    	return this._stateMachine.duel();
	}
	kill() {
    	return this._stateMachine.kill()
	}
	//----------------------------------------------------- --------------------------------------------- public methods
    toJSON(){
        let attacksJSON = [];
        for(let i = 0; i < this.attacks.length; i++) {
            attacksJSON.push(this.attacks[i].toJSON());
        }
        return {
            id:this.id,
            health:this.health,
            armor:this.armor,
            speed:this.speed,
            icon:this.icon,
            name:this.name,
            attacks:attacksJSON,
	        currentState:this._stateMachine.state
        };
    }
    getAttackByID(attackID) {
	    for(let i = 0; i < this.attacks.length; i++) {
	        if(this.attacks[i].id === attackID) {
	            return this.attacks[i];
            }
	    }
	    return undefined;
    }
	//------------------------------------------------- -------------------------------------------------- state machine
	//------------------------------------------------- ------------------------------------------------ All transitions
	_onBeforeTransition(lifecycle) {
		logs.log(E.logs.card,'~~~~~~~~~~~~~~~~ NEW CARD STATE CHANGE ~~~~~~~~~~~~~~~~ ');
		logs.log(E.logs.card, "On BEFORE transition - " + lifecycle.transition +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	_onAfterTransition(lifecycle) {
		logs.log(E.logs.card, "On AFTER transition  - " + lifecycle.transition +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	_onEnterState(lifecycle) {
		logs.log(E.logs.card, "On ENTER state       - " + lifecycle.to +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	_onLeaveState(lifecycle) {
		logs.log(E.logs.card, "On LEAVE state       - " + lifecycle.from +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
}
module.exports = Card;