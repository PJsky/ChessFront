const GameTurnReducer = (state = "", action) => {
    switch(action.type){
        case "SET_GAME_TURN":
            return state = action.payload;
        default:
            return state;
    }
}

export default GameTurnReducer;