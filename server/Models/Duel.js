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
			    attackB: json.cardB === undefined ? undefined : new Attack(json.attackB),
			    turns: [],
			    helpers: {

			    }
		    },
		    init:'waitingForCards',
		    transitions: [
			    {name:'addCard', from:'waitingForCards', to:'waitingForAttacks'          , dot:{color:'green'}},
			    {name:'addAttack', from:'waitingForAttacks', to:'ready'                  , dot:{color:'green'}},
			    {name:'handleInitiative', from:'ready', to:'initiative'                  , dot:{color:'green'}},

			    {name:'nextAttack', from:['initiative','attackerUpdated'], to:'newAttack', dot:{color:'blue'}},
			    {name:'handleCrushing',from:'newAttack',to:'crushingDone'                , dot:{color:'red'}},
			    {name:'handlePiercing',from:'crushingDone',to:'piercingDone'             , dot:{color:'red'}},
			    {name:'handleFlat',from:'piercingDone',to:'flatDone'                     , dot:{color:'red'}},
			    {name:'updateDefenderCard',from:'flatDone',to:'defenderUpdated'          , dot:{color:'red'}},
			    {name:'updateAttackerCard',from:'defenderUpdated',to:'attackerUpdated'   , dot:{color:'red'}},

			    {name:'finishDuel', from:'attackerUpdated', to:'displayResults'          , dot:{color:'red'}},

			    {name:'acceptResults', from:'displayResults', to:'waitingForCards'       , dot:{color:'red'}},
		    ],
		    methods: {
		    	onBeforeAddCard:    this._onBeforeAddCard,
			    onBeforeAddAttack:  this._onBeforeAddAttack,
			    onEnterInitiative: this._onEnterInitiative,
			    onEnterCrushing: this._onEnterCrushing,
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
	get currentState() {
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
	processDuel() {
    	if(this.attackA !== undefined && this.attackB !== undefined) {
    		if(this._stateMachine.handleInitiative()) {
    			while(this._stateMachine.turns.length > 0) {
    				let shouldBreak = true;
				    if(this._stateMachine.nextAttack()) {
					    if(this._stateMachine.handleCrushing()) {
							if(this._stateMachine.handlePiercing()) {
								if(this._stateMachine.handleFlat()) {
									if(this._stateMachine.updateDefenderCard()) {
										if(this._stateMachine.updateAttackerCard()) {
											this._stateMachine.turns.splice(0,1);
											shouldBreak = false;
										}
									}
								}
							}
					    }
				    }
				    if(shouldBreak) {
				    	break;
				    }
			    }
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
		if(card.canSelect) {
			card.selectCard();
		}
		if( (this.cardA !== undefined && this.cardB !== undefined)) {
			return this.cardA.currentState === 'lockedIn' && this.cardB.currentState === 'lockedIn';
		}
		return (this.cardA !== undefined && this.cardB !== undefined);
	}
	_onBeforeAddAttack(lifecycle,attack,letter) {
		logs.log(E.logs.duel,'attack '+letter +' selected '+ attack.id);
		this['attack'+letter] = attack;
		return (this.attackA !== undefined && this.attackB !== undefined);
	}
	_onEnterInitiative(lifecycle) {
    	this.turns = [];
    	let speedA = this.cardA.speed + this.attackA.speed;
    	let speedB = this.cardB.speed + this.attackB.speed;
    	if(speedA == speedB) {
		    if(Math.random() > 0.5) {
			    speedA += 0.001;
		    } else {
		    	speedB += 0.001;
		    }
	    }
		if(speedA > speedB) {
		    this.turns = [
		    	{letter:"A",powerMultiplier:1},
			    {letter:"B",powerMultiplier:1}];
		    if(speedA*2 > speedB) {
			    this.turns.splice(1, 0, {letter:"A",powerMultiplier:1});
		    } else if(speedA*1.5 > speedB) {
		    	this.turns.push({letter:"A",powerMultiplier:0.5})
		    }
	    } else if(speedB > speedA) {
			this.turns = [
				{letter:"B",powerMultiplier:1},
				{letter:"A",powerMultiplier:1}];
			if(speedB*2 > speedA) {
				this.turns.splice(1, 0, {letter:"B",powerMultiplier:1});
			} else if(speedB*1.5 > speedA) {
				this.turns.push({letter:"B",powerMultiplier:0.5})
			}
	    }
		logs.log(E.logs.duel,'Initative calculated with speed A = '+speedA +' and speed B = ' + speedB +', turn order is'+ JSON.stringify(this.turns));
    	return true;
	}
	_onEnterCrushing(lifecycle) {

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