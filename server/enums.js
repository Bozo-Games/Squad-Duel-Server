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
    }
};
module.exports = E;