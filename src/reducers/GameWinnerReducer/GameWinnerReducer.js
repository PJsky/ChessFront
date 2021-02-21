const GameWinnerReducer = (state = "", action) => {
    switch(action.type){
        case "SET_GAME_WINNER":
            return state = action.payload;
        default:
            return state;
    }
}

export default GameWinnerReducer;