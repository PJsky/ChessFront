const GamePlayersReducer = (state = "", action) => {
    switch(action.type){
        case "SET_GAME_PLAYERS":
            return state = action.payload;
        default:
            return state;
    }
}

export default GamePlayersReducer;