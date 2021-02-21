import {combineReducers} from 'redux'
import ChessBoardReducer from './ChessBoardReducer/ChessBoardReducer';
import EventCommunicationReducer from './EventCommunicationReducer/EventCommunicationReducer';
import GameHubReducer from './GameHubReducer/GameHubReducer';
import GamePlayersReducer from './GamePlayersReducer/GamePlayersReducer';
import GameTimersReducer from './GameTimersReducer/GameTimersReducer';
import GameTurnReducer from './GameTurnReducer/GameTurnReducer';
import GameWinnerReducer from './GameWinnerReducer/GameWinnerReducer';
import UserReducer from './UserReducer/UserReducer';

const combinedReducers = combineReducers({
    "logged_in": UserReducer,
    "gameHub": GameHubReducer,
    "chessBoard": ChessBoardReducer,
    "gamePlayers": GamePlayersReducer,
    "gameTurn": GameTurnReducer,
    "gameTimers": GameTimersReducer,
    "gameWinner": GameWinnerReducer,
    "events": EventCommunicationReducer
})

export default combinedReducers;