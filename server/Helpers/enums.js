//TODO think about uses not sure if ever really used
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
	    game: 0,
	    card: 1,
	    duel: 2,
	    attack: 3,
        player: 4,
        deck: 5,
    }
};
module.exports = E; //leave here so server can use