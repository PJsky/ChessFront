const GameTimersReducer = (state = "", action) => {
    switch(action.type){
        case "SET_GAME_TIMERS":
            return state = action.payload;
        default:
            return state;
    }
}

export default GameTimersReducer;