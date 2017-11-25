"use strict";
const E = require('./enums.js');
const Player = require('./Player.js');
class Game {
    constructor(json) {
        json = json === undefined ? {} : json;
        this.playerA = json.playerA === undefined ? new Player({status: 'Open'}) : new Player(json.playerA);
        this.playerB = json.playerB === undefined ? new Player({status: 'Open'}) : new Player(json.playerB);
        this.watchers = json.watchers === undefined ? [] : json.watchers; //an array of scocket IDs
        this.currentState = json.currentState === undefined ? E.GameStates.NewGame: json.currentState;

        this.handA = json.handA; //just the reported JSON
        this.handB = json.handB; //just the reported JSON

        this.selectedCardA = json.selectedCardA; //just the reported JSON
        this.selectedCardB = json.selectedCardB; //just the reported JSON
        this.selectedAttackA = json.selectedAttackA; //just the reported JSON
        this.selectedAttackB = json.selectedAttackB; //just the reported JSON
    }
    toJSON() {
        return {
            playerA: this.playerA === undefined ? undefined : this.playerA.toJSON(),
            playerB: this.playerB === undefined ? undefined : this.playerB.toJSON(),
            selectedCardA: this.selectedCardA,
            selectedCardB: this.selectedCardB,
            selectedAttackA: this.selectedAttackA,
            selectedAttackB: this.selectedAttackB,
            handA: this.handA === undefined ? {} : this.handA,
            handB: this.handB === undefined ? {} : this.handB,
            watchers: this.watchers,
            currentState: this.currentState
        }
    }
    updateState() {
        switch (this.currentState) {
            case E.GameStates.NewGame:
                if(this.playerA.status === E.PlayerStatus.Filled && this.playerB.status === E.PlayerStatus.Filled ) {
                    this.currentState = E.GameStates.WaitingForPlayers;
                }
                break;
            case E.GameStates.WaitingForPlayerA:
                if(this.selectedAttackA !== undefined && this.selectedAttackB !==  undefined) {
                    this.currentState = E.GameStates.ReadyToDuel;
                }
                break;
            case E.GameStates.WaitingForPlayerB:
                if(this.selectedAttackA !== undefined && this.selectedAttackB !==  undefined) {
                    this.currentState = E.GameStates.ReadyToDuel;
                }
                break;
            case E.GameStates.WaitingForPlayers:
                if(this.selectedAttackA !== undefined && this.selectedAttackB ===  undefined) {
                    this.currentState = E.GameStates.WaitingForPlayerB;
                } else if(this.selectedAttackB !== undefined && this.selectedAttackA ===  undefined) {
                    this.currentState = E.GameStates.WaitingForPlayerA;
                }
                break;
            default:
                break;
        }

    }
}

module.exports = Game;