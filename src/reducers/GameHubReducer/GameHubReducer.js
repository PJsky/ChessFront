const GameHubReducer = (
    state = "abc"
, action) => {
    switch(action.type){
        case "HUB_CONNECT":
            return state = action.payload;
        default:
            return state;
    }
}

export default GameHubReducer;