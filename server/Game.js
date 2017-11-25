"use strict";
const Player = require('./Player.js');
const GameStates = {
    NewGame: 0,
    WaitingForPlayerA: 1,
    WaitingForPlayerB: 2,
    WaitingForPlayers: 3,
    ReadyToDuel: 4,
};
class Game {
    constructor(json) {
        json = json === undefined ? {} : json;
        this.playerA = json.playerA === undefined ? new Player({status: 'Open'}) : new Player(json.playerA);
        this.playerB = json.playerB === undefined ? new Player({status: 'Open'}) : new Player(json.playerB);
        this.watchers = json.watchers === undefined ? [] : json.watchers; //an array of scocket IDs
        this.currentState = json.currentState === undefined ? GameStates.NewGame: json.currentState;


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
            watchers: this.watchers,
            currentState: this.currentState
        }
    }
    updateState() {
        switch (this.currentState) {
            case GameStates.NewGame:
                if(this.playerA.status === PlayerStatus.Filled && this.playerB.status === PlayerStatus.Filled ) {
                    this.currentState = GameStates.WaitingForPlayers;
                }
                break;
            case GameStates.WaitingForPlayerA:
                if(this.selectedAttackA !== undefined && this.selectedAttackB !==  undefined) {
                    this.currentState = GameStates.ReadyToDuel;
                }
                break;
            case GameStates.WaitingForPlayerB:
                if(this.selectedAttackA !== undefined && this.selectedAttackB !==  undefined) {
                    this.currentState = GameStates.ReadyToDuel;
                }
                break;
            case GameStates.WaitingForPlayers:
                if(this.selectedAttackA !== undefined && this.selectedAttackB ===  undefined) {
                    this.currentState = GameStates.WaitingForPlayerB;
                } else if(this.selectedAttackB !== undefined && this.selectedAttackA ===  undefined) {
                    this.currentState == GameStates.WaitingForPlayerA;
                }
                break;
            default:
                break;
        }

    }
}

module.exports = Game;