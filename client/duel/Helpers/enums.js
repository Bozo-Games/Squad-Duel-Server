const E = {
    PlayerStatus: {
        Open: 0,
        Filled: 1
    },
    GameStates: {
        NewGame: 0,
        WaitingForPlayerA: 1,
        WaitingForPlayerB: 2,
        WaitingForPlayers: 3,
        ReadyToDuel: 4,
        playerAWinsByForfeit: 5,
        playerBWinsByForfeit: 6
    },
    Status: {
        failure: 0,
        success: 1,
    },
    logs: {
	    gameStateMachine: 0,
	    serverGameClass: 1,
	    cardStateMachine: 2,
	    duelStateMachine: 2
    }
};
module.exports = E; //leave here so server can use