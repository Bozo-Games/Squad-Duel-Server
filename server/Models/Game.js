"use strict";
const E = require('../Helpers/Enums.js');
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
    playerJoin(player) {
        if(this.playerA.socketID === undefined) {
            this.playerA = player;
        } else if(this.playerB.socketID === undefined) {
            this.playerB = player;
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
            this.currentState = E.GameStates.playerBWinsByForfeit;
        } else if (this.playerB.socketID === player.socketID) {
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
        ["A","B"].forEach(function (key) {
            if(this.duel["card"+key] !== undefined) {
                if(this.duel["card"+key].id === card.id) {
                    //do nothing
                } else {
                    this["hand"+key].cards.push(this.duel["card"+key]);
                    this.duel["card"+key] = undefined;
                }
            }
            for(let i = this["hand"+key].cards.length-1;  i >= 0; i--) {
                if(this["hand"+key].cards[i].id === card.id) {
                    this["hand"+key].cards.splice(i,1);
                    this.duel["card"+key] = card;
                    break;
                }
            }
        });
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
        });
    }
}

module.exports = Game;