"use strict";
const generate = require('../Helpers/DataGenerator.js');
const E = require('../../client/duel/Helpers/Enums.js');
const defualts = require('../../client/duel/Helpers/defaults.js');
const Attack = require('./Attack.js');
const StateMachine = require('javascript-state-machine');
const logs = require('../Helpers/logger.js');
class Card {
    constructor(json) {
        json = json === undefined ? generate.card() : json;
        this.id = json.id === undefined ? -1 : json.id;
        this.health = json.health === undefined ? 0 : json.health;
        this.armor = json.armor === undefined ? 0 : json.armor;
        this.speed = json.speed === undefined ? 0 : json.speed;
        this.icon = json.icon === undefined ? 0 : json.icon;
	    this.name = json.name === undefined ? 'Card -1' : json.name;
        json.attacks = json.attacks === undefined ? [] : json.attacks;

	    this._stateMachine = new StateMachine({
		    data: {
			    id: json.id === undefined ? -1 : json.id //prob no needed ever but if the card stats are ever need for SM then needs to be moved down like server game model but this would be more involoved cuase of prces duel
		    },
		    init:'inDeck',
		    transitions: [
			    {name:'dealToPlayerA', from:'inDeck', to:'inHandA'},
			    {name:'dealToPlayerB', from:'inDeck', to:'inHandB'},

			    {name:'selectCard', from:'inHandA', to:'selectedA'},
			    {name:'selectCard', from:'inHandB', to:'selectedB'},

			    {name:'returnToHand',from:'selectedA', to:'inHandA'},
			    {name:'returnToHand',from:'selectedB', to:'inHandB'},

			    {name:'duel', from:['selectedA','selectedB'], to:'dueling'},

			    {name:'kill',            from:'dueling', to:'dead'},
			    {name:'returnToPlayerA', from:'dueling', to:'inHandA'},
			    {name:'returnToPlayerB', from:'dueling', to:'inHandB'}
		    ],
		    methods: {
			    //All state changes globaly
			    onBeforeTransition: this.onBeforeTransition,
			    onAfterTransition: this.onAfterTransition,
			    onEnterState: this.onEnterState,
			    onLeaveState: this.onLeaveState
		    }
	    });

        this.attacks = [];
        for(let i = 0; i < json.attacks.length; i++) {
            this.attacks.push(new Attack(json.attacks[i]));
        }
        while(this.attacks.length < defualts.server.card.numberOfAttacks) {
            this.attacks.push(new Attack());
        }
    }
    //------------------------------------------------- state machine
	//All transitions
	onBeforeTransition(lifecycle) {
		logs.log(E.logs.cardStateMachine, "On BEFORE transition - " + lifecycle.transition +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	onAfterTransition(lifecycle) {
		logs.log(E.logs.cardStateMachine, "On AFTER transition  - " + lifecycle.transition +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	onEnterState(lifecycle) {
		logs.log(E.logs.cardStateMachine, "On ENTER state       - " + lifecycle.to +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	onLeaveState(lifecycle) {
		logs.log(E.logs.cardStateMachine,"---------------------\n");
		logs.log(E.logs.cardStateMachine, "On LEAVE state       - " + lifecycle.from +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	//----------------------------------------------------- public methods
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
    getAttack(attackID) {
	    for(let i = 0; i < this.attacks.length; i++) {
	        if(this.attacks[i].id === attackID) {
	            return this.attacks[i];
            }
	    }
	    return undefined;
    }
	dealToPlayerA() {
		this._stateMachine.dealToPlayerA();
	}
	dealToPlayerB() {
		this._stateMachine.dealToPlayerB();
	}
	selectCard() {
    	this._stateMachine.selectCard();
	}
	returnToHand() {
    	this._stateMachine.returnToHand();
	}
}
module.exports = Card;