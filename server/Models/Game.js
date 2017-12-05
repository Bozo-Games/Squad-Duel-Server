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
    constructor(json) {
        json = json === undefined ? {} : json;

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
	            onEnterNewGame: this.onEnterNewGame,
	            onLeaveNewGame: this.onLeaveNewGame,

	            onEnterCardSelectingStage: this.onEnterCardSelectingStage,
                //transitions
	            onBeforePlayerJoin: this.onBeforePlayerJoin,
	            onAfterPlayerJoin: this.onAfterPlayerJoin,

	            onBeforePlayerLeave:this.onBeforePlayerLeave,
	            onAfterPlayerLeave:this.onAfterPlayerLeave,

	            onBeforeSelectCard:this.onBeforeSelectCard,

	            //All state changes globaly
	            onBeforeTransition: this.onBeforeTransition,
	            onAfterTransition: this.onAfterTransition,
	            onEnterState: this.onEnterState,
	            onLeaveState: this.onLeaveState
            }
        });
        this.watchers = json.watchers === undefined ? [] : json.watchers; //an array of scocket IDs

        this.debug = 'debug';
    }

    //State life cycle methods
	onEnterNewGame(lifecycle) {
		return true;
	}
	onLeaveNewGame(lifecycle) {
		return true;
	}
	//Transitions
	//Player Join
	onBeforePlayerJoin(lifecycle,player) {
		if(this.playerA.socketID === undefined) {
			logs.log(E.logs.gameStateMachine, player.socketID + " will be player A with name - "+player.name);
			this.playerA = player;
			return true;
		} else if(this.playerB.socketID === undefined) {
			logs.log(E.logs.gameStateMachine, player.socketID + " will be player B with name - "+player.name);
			this.playerB = player;
			return true;
		} else {
			logs.log(E.logs.gameStateMachine, player.socketID + " will be player spectator (not implemented)");

			return true;
		}
	}
	onAfterPlayerJoin(lifecycle,player) {
		return true;
	}
	//Player leave
	onBeforePlayerLeave(lifecycle,player) {
		if(this.playerA.socketID === player.socketID) {
			this.playerA = new Player();
			this.currentState = E.GameStates.playerBWinsByForfeit;
		} else if (this.playerB.socketID === player.socketID) {
			this.playerB = new Player();
			this.currentState = E.GameStates.playerAWinsByForfeit;
		} else {
			for(let i = this.watchers.length-1; i >= 0; i--) {
				if(this.watchers[i].socketID === player.socketID) {
					this.watchers.splice(i,1);
					break;
				}
			}
		}
	}
	onAfterPlayerLeave(lifecycle,player) {
		return true;
	}
	onEnterCardSelectingStage(lifecycle) {
		logs.log(E.logs.gameStateMachine, "On Enter card select from ");
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
	onBeforeSelectCard(lifecycle,playerID,cardID) {
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
				this.changeCard(playerID,oldCardID,newCardID);
				return false;
			} else {
				let card = this['hand'+letter].getCard(cardID);
				if(card !== undefined) {
					card.isSelected = true;
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
	onBeforeSelectAttack(lifecycle,playerID,cattackID) {
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
//------------------------------------------------------------------------------ getters
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
//------------------------------------------------------------------------------ public methods
	playerJoin(player) {
    	//checking validity of
		if(player !== undefined) {
			if(player.socketID !== undefined) {
				if(!this.playerIsPartOfGame(player)) {
					this._stateMachine.playerJoin(player);
				} else {
					logs.log(E.logs.serverGameClass,player.socketID + ' is already Part of the game and can\'t join until they leave.');
					this._stateMachine.playerLeave(player);
					this.playerJoin(player);
				}
			}  else {
				logs.log(E.logs.serverGameClass,"Player tried to join with out a socket ID");
			}
		} else {
			logs.log(E.logs.serverGameClass,"Player tried to join with out being defined");
		}
	}
	playerLeave(player) {
		if(player !== undefined) {
			if(player.socketID !== undefined) {
				if(this.playerIsPartOfGame(player)) {
					this._stateMachine.playerLeave(player);
				} else {
					logs.log(E.logs.serverGameClass,player.socketID + ' not part of the game and can\'t leave.');
				}
			}  else {
				logs.log(E.logs.serverGameClass,"Player tried to leave with out a socket ID");
			}
		} else {
			logs.log(E.logs.serverGameClass,"Player tried to leave with out being defined");
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
	//--------------------------------------------------------------------------- Helpers
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
			watchers: this.watchers,
			currentState: this.currentState
		}
	}
	//Other methods
    toString() {
        return "{playerA: "+this.playerA.toString() +",\n"+
            "handA: "+this.handA.toString()+",\n"+
            "playerB: "+this.playerB.toString() +",\n"+
            "handB: "+this.handB.toString()+",\n"+
            "duel: "+this.duel.toString();
    }
	proccessDuel() {
        let cards = this.duel.proccessDuel();
        if(cards.A !== undefined) {
	        this.handA.cards.push(cards.A);
        }
        if(cards.B !== undefined) {
	        this.handB.cards.push(cards.B);
        }
    }
}

module.exports = Game;