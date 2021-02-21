
const ChessBoardReducer = (state ="", action) => {
    switch(action.type){
        case "SET_CHESSBOARD":
            return state=action.payload;
        default:
            return state;
    }
}

export default ChessBoardReducer;