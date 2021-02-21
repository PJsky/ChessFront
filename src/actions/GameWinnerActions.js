export const set_game_winner = (turn) => {
    return{
        type: 'SET_GAME_WINNER',
        payload: turn
    }
}