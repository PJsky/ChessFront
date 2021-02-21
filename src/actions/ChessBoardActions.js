export const set_chessboard = (serializedBoard) => {
    return{
        type: 'SET_CHESSBOARD',
        payload: serializedBoard
    }
}

export const make_a_move = (group, moveString) => {
    return{
        type: 'MAKE_A_MOVE',
        group: group,
        payload: moveString
    }
}