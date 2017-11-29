"use strict";
const E = require('../../client/duel/Helpers/Enums.js');
const generate = require('../Helpers/DataGenerator.js')
const Player = require('./Player.js');
const Card = require('./Card.js');
const Duel = require('./Duel.js');
const Hand = require('./Hand.js');
const Attack = require('./Attack.js');

class Game {
    constructor(json) {
        json = json === undefined ? {} : json;
        this.playerA = json.playerA === undefined ? new Player({status: 'Open'}) : new Player(json.playerA);
        this.playerB = json.playerB === undefined ? new Player({status: 'Open'}) : new Player(json.playerB);
        this.watchers = json.watchers === undefined ? [] : json.watchers; //an array of scocket IDs

        this.currentState = json.currentState === undefined ? E.GameStates.NewGame: json.currentState;

        this.handA = new Hand(json.handA);
        this.handB = new Hand(json.handB);

        this.duel = new Duel(json.duel);
    }
    toJSON() {
        return {
            playerA: this.playerA === undefined ? undefined : this.playerA.toJSON(),
            playerB: this.playerB === undefined ? undefined : this.playerB.toJSON(),
            handA: this.handA === undefined ? undefined : this.handA.toJSON(),
            handB: this.handB === undefined ? undefined : this.handB.toJSON(),
            duel: this.duel === undefined ? undefined :  this.duel.toJSON(),
            watchers: this.watchers,
            currentState: this.currentState
        }
    }
    toString() {
        return "{playerA: "+this.playerA.toString() +",\n"+
            "handA: "+this.handA.toString()+",\n"+
            "playerB: "+this.playerB.toString() +",\n"+
            "handB: "+this.handB.toString()+",\n"+
            "duel: "+this.duel.toString();
    }
    dealNewHands() {
        this.handA = new Hand(generate.hand());
        this.handB = new Hand(generate.hand());
    }
    playerJoin(player) {
        if(this.playerA.socketID === undefined) {
            this.playerA = player;
            this.currentState = E.GameStates.WaitingForPlayerB;
            this.dealNewHands();
        } else if(this.playerB.socketID === undefined) {
            this.playerB = player;
            this.dealNewHands();
        } else {
            let found = false;
            for(let i = this.watchers.length-1; i >= 0; i--) {
                if(this.watchers[i].socketID === player.socketID) {
                    found = true;
                    break;
                }
            }
            if(!found) {
                this.watchers.push(player);
            }
        }
    }
    playerLeave(player) {
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
    selectCard(player, card) {
        console.log(card.id);
        ["A","B"].forEach(function (key) {
            if(this.duel["card"+key] !== undefined) {
                if(this.duel["card"+key].id === card.id) {
                    //do nothing
                } else {
                    this["hand"+key].cards.push(new Card(this.duel["card"+key].toJSON()));
                    this.duel["card"+key] = undefined;
                }
            }
            for(let i = this["hand"+key].cards.length-1;  i >= 0; i--) {
                if(this["hand"+key].cards[i].id === card.id) {
                    console.log('found '+this["hand"+key].cards.length);
                    this["hand"+key].cards.splice(i,1);
                    console.log('found '+this["hand"+key].cards.length);
                    this.duel["card"+key] = card;
                    break;
                }
            }
        }.bind(this));
        return {status:E.Status.success}; //thing about this some
    }
    selectAttack(player, attack) {
        ["A","B"].forEach(function (key) {
            if(this.duel["attack"+key] !== undefined) {
                if(this.duel["card"+key].id === attack.id) {
                    //do nothing
                } else {
                    this.duel["attack"+key] = undefined;
                }
            }
            for(let i = this["hand"+key].cards.length-1;  i >= 0; i--) {
                if(this["hand"+key].cards[i].id === card.id) {
                    this["hand"+key].cards.splice(i,1);
                    this.duel["card"+key] = card;
                    break;
                }
            }
        }.bind(this));
    }
}

module.exports = Game;