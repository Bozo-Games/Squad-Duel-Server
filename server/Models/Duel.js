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
			    attacker: undefined,
			    defender: undefined,
			    attackPoerMultiplier: undefined,
		    },
		    init:'waitingForCards',
		    transitions: [                                                                    // For drawing  State machine
			    {name:'addCard', from:'waitingForCards', to:'waitingForAttacks'              , dot:{color:'green'}},
			    {name:'addAttack', from:'waitingForAttacks', to:'ready'                      , dot:{color:'green'}},
			    {name:'handleInitiative', from:'ready', to:'initiativeDone'                  , dot:{color:'green'}},

			    {name:'nextAttack', from:['initiativeDone','attackFinished'], to:'newAttack' , dot:{color:'green'}},
			    {name:'handleCrushing',from:'newAttack',to:'crushingDone'                    , dot:{color:'green'}},
			    {name:'handlePiercing',from:'crushingDone',to:'piercingDone'                 , dot:{color:'green'}},
			    {name:'handleFlat',from:'piercingDone',to:'flatDone'                         , dot:{color:'green'}},
			    {name:'finishAttack',from:'flatDone',to:'attackFinished'                     , dot:{color:'green'}},
			                                                                                 
			    {name:'finishDuel', from:'attackFinished', to:'displayResults'                 , dot:{color:'green'}},
			                                                                                 
			    {name:'acceptResults', from:'displayResults', to:'waitingForCards'           , dot:{color:'blue'}},
		    ],
		    methods: {
		    	onBeforeAddCard:    this._onBeforeAddCard,
			    onBeforeAddAttack:  this._onBeforeAddAttack,
			    onEnterInitiativeDone: this._onEnterInitiativeDone,
			    onEnterNewAttack: this._onEnterNewAttack,
			    onEnterCrushingDone: this._onEnterCrushingDone,
			    onEnterPiercingDone: this._onEnterPiercingDone,
			    onEnterFlatDone:this._onEnterFlatDone,
			    onBeforeFinishDuel:this._onBeforeFinishDuel,
			    onBeforeNextAttack:this._onBeforeNextAttack,
			    onEnterWaitingForCards:this._onEnterWaitingForCards,
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
	_onEnterInitiativeDone(lifecycle) {
    	this.cardA.duel();
    	this.cardB.duel();
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
		    if(speedA > speedB*2) {
			    this.turns.splice(1, 0, {letter:"A",powerMultiplier:1});
		    } else if(speedA > speedB*1.5) {
		    	this.turns.push({letter:"A",powerMultiplier:0.5})
		    }
	    } else if(speedB > speedA) {
			this.turns = [
				{letter:"B",powerMultiplier:1},
				{letter:"A",powerMultiplier:1}];
			if(speedB > speedA*2) {
				this.turns.splice(1, 0, {letter:"B",powerMultiplier:1});
			} else if(speedB > speedA*1.5) {
				this.turns.push({letter:"B",powerMultiplier:0.5})
			}
	    }
		logs.log(E.logs.duel,'Imitative calculated with speed A = '+speedA +' and speed B = ' + speedB +', turn order is'+ JSON.stringify(this.turns));
    	return true;
	}
	_onEnterNewAttack(lifecycle) {
    	if(lifecycle.from === 'attackFinished') {
			this.turns.splice(0,1);
	    }
	    if(this.turns.length > 0) {
		    let turn = this.turns[0];
		    this.attackPoerMultiplier = turn.powerMultiplier;
		    this.attacker = turn.letter;
		    if (this.attacker === 'A') {
			    this.defender = 'B';
		    }
		    else {
			    this.defender = 'A';
		    }
		    return true;
	    } else {
    		return false;
	    }
	}
	_onEnterCrushingDone(lifecycle) {
    	if(this['attack'+this.attacker].category === 'crush') {
    		let dmg = this['attack'+this.attacker].power*this.attackPoerMultiplier;
		    let armorLeft = this['card'+this.defender].armor - dmg;
		    this['card'+this.defender].armor = Math.max(0,armorLeft);
		    logs.log(E.logs.duel,this.attacker + ' crushes '+this.defender+'\'s armor reducing it t '+this['card'+this.defender].armor );
		    if(armorLeft < 0) {
			    this['card'+this.defender].health = this['card'+this.defender].health  + armorLeft;
			    logs.log(E.logs.duel,this.attacker + ' crushing damage roles over dealing '+(-1*armorLeft)+' damage reducing card '+this.defender+'\'s health to '+this['card'+this.defender].health);
		    }
		    return true;
	    }
		logs.log(E.logs.duel,'Attack '+this['attack'+this.attacker]+' is not in the crush category, skipping crush dmg.');
		return true;
	}
	_onEnterPiercingDone(lifecycle) {
		if(this['attack'+this.attacker].category === 'pierce') {
			let dmg = this['attack'+this.attacker].power*this.attackPoerMultiplier;
			this['card'+this.defender].health = Math.max(0,this['card'+this.defender].health  - dmg);
			logs.log(E.logs.duel,this.attacker + ' pierces '+this.defender+' for '+(dmg)+' reducing card '+this.defender+'\'s health to '+this['card'+this.defender].health);
			return true;
		}
		logs.log(E.logs.duel,'Attack '+this['attack'+this.attacker]+' is not in the pierce category, skipping pierce dmg.');
		return true;
	}
	_onEnterFlatDone(lifecycle) {
    	if(this['attack'+this.attacker].category === 'flat') {
    		let dmg = this['card'+this.defender].armor - this['attack'+this.attacker].power*this.attackPoerMultiplier;
			if(dmg < 0) {
				dmg = -1*dmg;
				this['card'+this.defender].health = Math.max(0,this['card'+this.defender].health  - dmg);
				logs.log(E.logs.duel,this.attacker + ' flats '+this.defender+' for '+(dmg)+' reducing card '+this.defender+'\'s health to '+this['card'+this.defender].health);
				return true;
			}
		    logs.log(E.logs.duel,this.attacker + ' fails to effect andy flat damage because of armor');
		    return true;
		}
		logs.log(E.logs.duel,'Attack '+this['attack'+this.attacker].id+' is not in the flat category, skipping flat dmg.');
		return true;
	}
	_onBeforeNextAttack(lifeCycle) {
    	if(lifeCycle.from != 'initiativeDone') {
    		return this.turns.length > 1;
	    }
	    return true;
	}
	_onBeforeFinishDuel(lifeCycle) {
    	return this.turns.length <=1;
	}
	_onEnterWaitingForCards(lifeCycle) {
    	if(lifeCycle.transition == 'acceptResults') {
		    if(this.cardA.currentState == 'dueling') {
			    this.cardA.returnToHand();
		    }
		    if(this.cardB.currentState == 'dueling') {
			    this.cardB.returnToHand();
		    }
		    this.cardA = undefined;
		    this.cardB = undefined;
		    this.attackA = undefined;
		    this.attackB = undefined;

	    }
    	return true;
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