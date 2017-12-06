"use strict";
const E = require('../../client/duel/Helpers/Enums.js');
const logs = require('../Helpers/logger.js');
const generate = require('../Helpers/DataGenerator.js');
const StateMachine = require('javascript-state-machine');
const defualts = require('../../client/duel/Helpers/defaults.js');
const Player = require('./Player.js');
const Card = require('./Card.js');
const Duel = require('./Duel.js');
const Hand = require('./Hand.js');
const Deck = require('./Deck.js');
const Attack = require('./Attack.js');
class Game {
    constructor() {
        this._stateMachine = new StateMachine({
	        data: {
		        playerA: new Player(),
		        playerB: new Player(),
		        spectators:[],
		        handA: undefined,
		        handB: undefined,
		        duel: new Duel(),
	        },
            init:'newGame',
            transitions: [
                {name:'playerJoin', from:'newGame', to:'waitingFor2ndPlayer'},
	            {name:'playerJoin', from:'waitingFor2ndPlayer', to:'cardSelectingStage'},
	            {name:'playerLeave', from:'waitingFor2ndPlayer', to:'newGame'},

	            {name:'selectCard', from:'cardSelectingStage', to:'waitingFor2ndCardToBeSelected'},
	            {name:'selectCard', from:'waitingFor2ndCardToBeSelected', to:'attackSelectingStage'},
	            {name:'changeCard', from:'waitingFor2ndCardToBeSelected', to:'cardSelectingStage'},

	            {name:'selectAttack', from:'attackSelectingStage', to:'waitingFor2ndAttackToBeSelected'},
	            {name:'selectAttack', from:'waitingFor2ndAttackToBeSelected', to:'resolvingDuel'},
	            {name:'changeAttack', from:'waitingFor2ndAttackToBeSelected', to:'attackSelectingStage'},

	            {name:'duelResolved', from:'resolvingDuel', to:'showingDuelResults'},
	            {name:'declareVictor', from:'showingDuelResults', to:'endGame'},
	            {name:'continueGame', from:'showingDuelResults', to:'cardSelectingStage'},
            ],
            methods: {
                //states
	            onEnterCardSelectingStage: this._onEnterCardSelectingStage,
                //transitions
	            onBeforePlayerJoin: this._onBeforePlayerJoin,

	            onBeforePlayerLeave:this._onBeforePlayerLeave,

	            onBeforeSelectCard:this._onBeforeSelectCard,
	            onBeforeChangeCard:this._onBeforeChangeCard,

	            //All state changes globaly
	            onBeforeTransition: this._onBeforeTransition,
	            onAfterTransition: this._onAfterTransition,
	            onEnterState: this._onEnterState,
	            onLeaveState: this._onLeaveState
            }
        });
    }
	//------------------------------------------------- -------------------------------------------------------- Getters
	get playerA() {
		return this._stateMachine.playerA;
	}
	get playerB() {
		return this._stateMachine.playerB;
	}
	get spectators() {
		return this._stateMachine.spectators;
	}
	get currentState() {
		return this._stateMachine.state;
	}
	get handA() {
		return this._stateMachine.handA;
	}
	get handB() {
		return this._stateMachine.handB;
	}
	get duel() {
		return this._stateMachine.duel;
	}
	//------------------------------------------------- -------------------------------------------------------- Setters
	//----------------------------------------------------- -------------------------------- public State Machine Events
	playerJoin(player) {
		//checking validity of player
		if(this._validatePlayer(player)) {
			if(!this.playerIsPartOfGame(player)) {
				return this._stateMachine.playerJoin(player);
			} else {
				logs.log(E.logs.serverGameClass,player.socketID + ' is already Part of the game and can\'t join until they leave.');
				this._stateMachine.playerLeave(player);
				return this.playerJoin(player);
			}
		} else {
			logs.log(E.logs.serverGameClass,player + ' is not a valid argument for playerJoin()');
			return false;
		}
	}
	playerLeave(player) {
    	if(this._validatePlayer(player)) {
		    if(this.playerIsPartOfGame(player)) {
			    console.log("here");
			    return this._stateMachine.playerLeave(player);
		    } else {
			    logs.log(E.logs.serverGameClass,player.socketID + ' not part of the game and can\'t leave.');
			    return false;
		    }
	    } else {
		    logs.log(E.logs.serverGameClass,player + ' is not a valid argument for playerLeave()');
		    return false;
	    }
	}
	selectCard(playerID, cardID) {
		if(playerID === undefined || cardID === undefined) {
			logs.log(E.logs.serverGameClass,"Can't select a card if player ("+playerID+") or card ("+cardID+") are undefined");
		} else {
			if(this.playerIsPartOfGame(new Player({socketID:playerID}))) {
				this._stateMachine.selectCard(playerID,cardID);
			} else {
				logs.log(E.logs.serverGameClass,playerID+"is not part of game and can't select a card");
			}
		}
	}
	selectAttack(playerID, attackID) {
		if(playerID === undefined || attackID === undefined) {
			logs.log(E.logs.serverGameClass,"Can't select a card if player ("+playerID+") or attack ("+attackID+") are undefined");
		} else {
			if(this.playerIsPartOfGame(new Player({socketID:playerID}))) {
				this._stateMachine.selectAttack(playerID,attackID);
			} else {
				logs.log(E.logs.serverGameClass,playerID+"is not part of game and can't select a card");
			}
		}
	}
	//----------------------------------------------------- --------------------------------------------- public methods
	playerIsPartOfGame(player) {
		if(player ===  undefined) {
			return false;
		}
		if(player.socketID === undefined) {
			return false;
		}
		if(this.playerA.socketID !== undefined && player.socketID === this.playerA.socketID) {
			return true;
		} else if (this.playerB.socketID !== undefined && player.socketID === this.playerB.socketID) {
			return true;
		} else {
			let found = false;
			for(let i = 0; i  < this.spectators.length; i++) {
				let spectator = this.spectators[i];
				if(spectator.socketID === player.socketID) {
					found = true;
					break;
				}
			}
			return found;
		}
	}
	toJSON() {
		return {
			playerA: this.playerA.toJSON(),
			playerB: this.playerB.toJSON(),
			handA: this.handA === undefined ? undefined : this.handA.toJSON(),
			handB: this.handB === undefined ? undefined : this.handB.toJSON(),
			duel: this.duel === undefined ? undefined :  this.duel.toJSON(),
			spectators: this.spectators,
			currentState: this.currentState
		}
	}
	//------------------------------------------------- -------------------------------------------------- state machine
	_onBeforePlayerJoin(lifecycle,player) {
		if(this.playerA.socketID === undefined) {
			logs.log(E.logs.gameStateMachine, player.socketID + " will be player A with name - "+player.name);
			this.playerA = player;
			return true;
		} else if(this.playerB.socketID === undefined) {
			logs.log(E.logs.gameStateMachine, player.socketID + " will be player B with name - "+player.name);
			this.playerB = player;
			return true;
		} else {
			logs.log(E.logs.gameStateMachine, player.socketID + " will be player spectator");
			this.spectators.push(player);
			return true;
		}
	}
	_onBeforePlayerLeave(lifecycle,player) {
		if(this.playerA.socketID === player.socketID) {
			logs.log(E.logs.gameStateMachine, "player A has left the game");
			this.playerA = new Player();
			return true;
		} else if (this.playerB.socketID === player.socketID) {
			logs.log(E.logs.gameStateMachine, "player B has left the game");
			this.playerB = new Player();
			return true;
		} else {
			for(let i = this.spectators.length-1; i >= 0; i--) {
				if(this.spectators[i].socketID === player.socketID) {
					logs.log(E.logs.gameStateMachine, "a spectator has left the game");
					this.spectators.splice(i,1);
					return true;
				}
			}
			return false;
		}
	}
	_onEnterCardSelectingStage(lifecycle) {
		if(lifecycle.from === 'waitingFor2ndPlayer') {
			this.deck = new Deck();
			this.handA = new Hand();
			this.handB = new Hand();
			for(let i = 0; i < defualts.server.hand.numberOfCards; i++) {
				let card = this.deck.dealCard();
				card.dealToPlayerA();
				this.handA.cards.push(card);
				card = this.deck.dealCard();
				card.dealToPlayerB();
				this.handB.cards.push(card);
			}
		}
		return true;
	}
	_onBeforeSelectCard(lifecycle,playerID,cardID) {
		let letter;
		if(playerID === this.playerA.socketID) {
			letter = 'A';
		} else if(playerID === this.playerB.socketID) {
			letter = 'B';
		}
		if(letter === undefined) {
			logs.log(E.logs.gameStateMachine, playerID +' is a spectator and can not select a card');
		} else {
			if(this.duel['card'+letter] !== undefined) {
				let that = this;
				return new Promise(function(resolve, reject) {
					if(that.changeCard(playerID,that.duel['card'+letter].id,cardID)) {
						resolve();
					} else {
						reject();
					}
				});
			} else {
				let card = this['hand'+letter].getCard(cardID);
				if(card !== undefined) {
					card.selectCard();
					this.duel['card'+letter] = card;
					return true;
				} else {
					logs.log(E.logs.gameStateMachine, cardID+' is not in player'+letter+'\'s hand.');
					return false;
				}
			}
		}
		return true;
	}
	_onBeforeChangeCard(lifecycle,playerID,oldCardID,newCarID) {
		let letter;
		if(playerID === this.playerA.socketID) {
			letter = 'A';
		} else if(playerID === this.playerB.socketID) {
			letter = 'B';
		}if(letter === undefined) {
			logs.log(E.logs.gameStateMachine, playerID +' is a spectator and can not change card');
		} else {
			if(this.duel['card'+letter] !== undefined) {
				logs.log(E.logs.gameStateMachine, 'Card ' + letter + ' is not defined and the card can\'t be changed');
				return false;
			} else if(this.duel['card'+letter].id !== oldCardID) {
				logs.log(E.logs.gameStateMachine, this.duel['card'+letter].id + ' is not '+oldCardID+' and the card can\'t be changed');
				return false;
			} else {
				let oldCard = this['hand'+letter].getCard(cardID);
				oldCard.returnToHand();
				this.selectCard(playerID,newCarID);
			}
		}
	}
	_onBeforeSelectAttack(lifecycle,playerID,cattackID) {
		let letter;
		if(playerID === this.playerA.socketID) {
			letter = 'A';
		} else if(playerID === this.playerB.socketID) {
			letter = 'B';
		}
		if(letter === undefined) {
			logs.log(E.logs.gameStateMachine, playerID +' is a spectator and can not select an attack');
		} else {
			if(this.duel['attack'+letter] !== undefined) {
				this.changeAttack(playerID,oldAttackID,newAttackID);
				return false;
			} else {
				let attack = this.duel['card'+letter].getAttack(attackID);
				if(attack !== undefined) {
					attack.isSelected = true;
					this.duel['attack'+letter] = attack;
					return true;
				} else {
					logs.log(E.logs.gameStateMachine, attack+' is not part of the card'+letter+' and can\'t be selected.');
					return false;
				}
			}
		}
		return true;
	}
	//------------------------------------------------- -------------------------------------------------------- Helpers
	_validatePlayer(player) {
		if(player !== undefined) {
			if (player.socketID !== undefined) {
				return true;
			}
		}
		return false;
	}
	//------------------------------------------------- ------------------------------------------------ All transitions
	_onBeforeTransition(lifecycle) {
		logs.log(E.logs.gameStateMachine, "On BEFORE transition - " + lifecycle.transition +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	_onAfterTransition(lifecycle) {
		logs.log(E.logs.gameStateMachine, "On AFTER transition  - " + lifecycle.transition +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	_onEnterState(lifecycle) {
		logs.log(E.logs.gameStateMachine, "On ENTER state       - " + lifecycle.to +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	_onLeaveState(lifecycle) {
    	logs.log(E.logs.gameStateMachine,"---------------------\n");
		logs.log(E.logs.gameStateMachine, "On LEAVE state       - " + lifecycle.from +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
}

module.exports = Game;