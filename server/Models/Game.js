
const E = require('../Helpers/enums.js');
const logs = require('../Helpers/logger.js');
const generate = require('../Helpers/DataGenerator.js');
const StateMachine = require('javascript-state-machine');
const defaults = require('../Helpers/defaults.js');
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

		        getLetter: this._getPlayerLetter
	        },
            init:'newGame',
            transitions: [
                {name:'playerJoin', from:'newGame', to:'cardSelectingStage'},
	            {name:'playerLeave', from:'*', to:'endGame'},

	            {name:'selectCard', from:'cardSelectingStage', to:'attackSelectStage'},

	            {name:'selectAttack', from:'attackSelectStage', to:'readyToDuel'},

	            {name:'processDuel', from:'readyToDuel', to:'showingDuelResults'},

	            {name:'continueGame', from:'showingDuelResults', to:'cardSelectingStage'},

	            {name:'declareVictor', from:'showingDuelResults', to:'endGame'},
	            {name:'newGame', from:'endGame', to:'newGame'},
            ],
            methods: {
                //states
	            onEnterCardSelectingStage: this._onEnterCardSelectingStage,
                //transitions
	            onBeforePlayerJoin: this._onBeforePlayerJoin,

	            onBeforePlayerLeave:this._onBeforePlayerLeave,

	            onBeforeSelectCard:this._onBeforeSelectCard,
	            onBeforeSelectAttack:this._onBeforeSelectAttack,

	            onBeforeProcessDuel:this._onBeforeProcessDuel,
	            onBeforeContinueGame:this._onBeforeContinueGame,

	            //All state changes gloably
	            onBeforeTransition: this._onBeforeTransition,
	            onAfterTransition: this._onAfterTransition,
	            onEnterState: this._onEnterState,
	            onLeaveState: this._onLeaveState,
	            onInvalidTransition:this._onInvalidTransition
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
				logs.log(E.logs.game,player.socketID + ' is already Part of the game and can\'t join until they leave.');
				this._stateMachine.playerLeave(player);
				return this.playerJoin(player);
			}
		} else {
			logs.log(E.logs.game,player + ' is not a valid argument for playerJoin()');
			return false;
		}
	}
	playerLeave(player) {
    	if(this._validatePlayer(player)) {
		    if(this.playerIsPartOfGame(player)) {
			    return this._stateMachine.playerLeave(player);
		    } else {
			    logs.log(E.logs.game,player.socketID + ' not part of the game and can\'t leave.');
			    return false;
		    }
	    } else {
		    logs.log(E.logs.game,player + ' is not a valid argument for playerLeave()');
		    return false;
	    }
	}
	selectCard(playerID, cardID) {
		if(playerID === undefined || cardID === undefined) {
			logs.log(E.logs.game,"Can't select a card if player ("+playerID+") or card ("+cardID+") are undefined");
		} else {
			if(this.playerIsPartOfGame(new Player({socketID:playerID}))) {
				return this._stateMachine.selectCard(playerID,cardID);
			} else {
				logs.log(E.logs.game,playerID+" is not part of game and can't select a card");
			}
		}
		return false;
	}
	selectAttack(playerID, attackID) {
		if(playerID === undefined || attackID === undefined) {
			logs.log(E.logs.game,"Can't select a card if player ("+playerID+") or attack ("+attackID+") are undefined");
		} else {
			if(this.playerIsPartOfGame(new Player({socketID:playerID}))) {
				return this._stateMachine.selectAttack(playerID,attackID);
			} else {
				logs.log(E.logs.game,playerID+" is not part of game and can't select a card");
			}
		}
		return false;
	}
	processDuel() {
		return this._stateMachine.processDuel();
	}
	continueGame() {
		this.duel.acceptResults();
		if(!this._stateMachine.continueGame()) {
			return this._stateMachine.declareVictor();
		}
    	return true;
	}
	//----------------------------------------------------- --------------------------------------------- public methods
	confirmCard(playerID,cardID){
		let letter = this._getPlayerLetter(playerID);
		if(this.duel['card'+letter] !== undefined) {
			if(this.duel['card'+letter].id === cardID) {
				this.duel['card'+letter].confirm();
				this.selectCard(playerID,this.duel['card'+letter].id);
			}
		}
	}
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
			logs.log(E.logs.game, player.socketID + " will be player A with name - "+player.name);
			this.playerA = player;
			return (this.playerB.socketID !== undefined);
		} else if(this.playerB.socketID === undefined) {
			logs.log(E.logs.game, player.socketID + " will be player B with name - "+player.name);
			this.playerB = player;
			return (this.playerA.socketID !== undefined);
		} else {
			logs.log(E.logs.game, player.socketID + " will be player spectator");
			this.spectators.push(player);
			return false; //no transaction needed
		}
	}
	_onBeforePlayerLeave(lifecycle,player) {
		if(this.playerA.socketID === player.socketID) {
			logs.log(E.logs.game, "player A has left the game");
			this.playerA = new Player();
			return true;
		} else if (this.playerB.socketID === player.socketID) {
			logs.log(E.logs.game, "player B has left the game");
			this.playerB = new Player();
			return true;
		} else {
			for(let i = this.spectators.length-1; i >= 0; i--) {
				if(this.spectators[i].socketID === player.socketID) {
					logs.log(E.logs.game, "a spectator has left the game");
					this.spectators.splice(i,1);
					return true;
				}
			}
			return false;
		}
	}
	_onEnterCardSelectingStage(lifecycle) {
		if(lifecycle.from === 'newGame') {
			this.deck = new Deck();
			this.handA = new Hand();
			this.handB = new Hand();
			for(let i = 0; i < defaults.hand.numberOfCards; i++) {
				let card = this.deck.dealCard();
				card.dealToPlayer();
				this.handA.cards.push(card);
				card = this.deck.dealCard();
				card.dealToPlayer();
				this.handB.cards.push(card);
			}
		}
		return true;
	}
	_onBeforeSelectCard(lifecycle,playerID,cardID) {
		let letter = this.getLetter(playerID);
		if(letter === undefined) {
			logs.log(E.logs.game, playerID +' is a spectator and can not select a card');
		} else {
			if(this.duel['card'+letter] !== undefined) {
				if(this.duel['card'+letter].id !== cardID) {
					this.duel['card' + letter].returnToHand();
				}
			}
			let card = this["hand"+letter].getCardByID(cardID);
			return this.duel.addCard(card,letter);
		}
		return false;
	}
	_onBeforeSelectAttack(lifecycle,playerID,attackID) {
		let letter = this.getLetter(playerID);
		if(letter === undefined) {
			logs.log(E.logs.game, playerID +' is a spectator and can not select an attack');
		} else {
			return this.duel.addAttack(attackID,letter);
		}
		return true;
	}
	_onBeforeProcessDuel(lifecyle) {
		return this.duel.processDuel();
	}
	_onBeforeContinueGame(lifecyle) {
		let aKills = 0;
		let bKills = 0;
		for(let i = 0; i < this.handA.cards.length; i++) {
			if( this.handA.cards[i].currentState === 'dead') {
				aKills++;
			}
		}
		for(let i = 0; i < this.handB.cards.length; i++) {
			if( this.handB.cards[i].currentState === 'dead') {
				bKills++;
			}
		}
		return aKills < this.handA.cards.length && bKills < this.handB.cards.length;
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
	_getPlayerLetter(playerID) {
		if(playerID === this.playerA.socketID) {
			return 'A';
		} else if(playerID === this.playerB.socketID) {
			return 'B';
		}
	}
	//------------------------------------------------- ------------------------------------------------ All transitions
	_onBeforeTransition(lifecycle) {
    	logs.log(E.logs.game,`~~~~~~~~~~~~~~~~ NEW GAME STATE CHANGE ${lifecycle.from} -> ${lifecycle.transition} -> ${lifecycle.to}`);
		//logs.log(E.logs.game, "On BEFORE transition - " + lifecycle.transition.substring(0, 10) +"\t | " + lifecycle.from.substring(0, 10) + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	_onAfterTransition(lifecycle) {
		//logs.log(E.logs.game, "On AFTER transition  - " + lifecycle.transition.substring(0, 10) +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	_onEnterState(lifecycle) {
		//logs.log(E.logs.game, "On ENTER state       - " + lifecycle.to.substring(0, 10) +"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	_onLeaveState(lifecycle) {
		logs.log(E.logs.game,`~~~~~~~~~~~~~~~~ END GAME STATE CHANGE ${lifecycle.from} -> ${lifecycle.transition} -> ${lifecycle.to}`);
		//logs.log(E.logs.game, "On LEAVE state       - " + lifecycle.from.substring(0, 10)+"\t | " + lifecycle.from + ' -> ' + lifecycle.transition + ' -> ' + lifecycle.to);
		return true;
	}
	_onInvalidTransition(transition,from,to){
		logs.log(E.logs.game, 'INVALID TRANSITION   - transition ('+transition+') is not allowed from state ('+from+') to state ('+to+')');
		throw new Exception('transition ('+transition+') is not allowed from state ('+from+') to state ('+to+')');
	}
}

module.exports = Game;

