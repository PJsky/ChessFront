import axios from 'axios'
import { useEffect, useState } from 'react';
import * as signalr from '@aspnet/signalr';
import ChessBoard from './ChessBoard/ChessBoard';
import { hub_join_group} from '../actions/GameHubActions';
import { make_a_move } from '../actions/ChessBoardActions';
import { set_game_turn } from '../actions/GameTurnActions';
import {useDispatch, useSelector} from 'react-redux';
import WinnerModal from './Modals/WinnerModal';


const GameRoom = (props) => {
  const unserializedChessBoard = useSelector(state => state.chessBoard);
  const players = useSelector(state => state.gamePlayers);
  const playersTurn = useSelector(state => state.gameTurn); 
  const dispatch = useDispatch();
  
  const ticking = useSelector(state => state.gameTimers.ticking);
  const gameTimersWhite = useSelector(state => state.gameTimers.whiteTime);
  const gameTimersBlack = useSelector(state => state.gameTimers.blackTime);
  const winner = useSelector(state => state.gameWinner);
  const [whiteTime, setWhiteTime] = useState(30);
  const [blackTime, setBlackTime] = useState(30);
  const [isWinnerModalOpen,setIsWinnerModalOpen] = useState(false);
  const [winnerName, setWinnerName] = useState("");

  
    useEffect(() => {
      if(ticking == "White"){
        const intervalWhite = setInterval(() => {
          setWhiteTime(whiteTime => whiteTime>0?whiteTime - 1: whiteTime);
        }, 1000);
        return () => clearInterval(intervalWhite);
      }
      else if(ticking == "Black"){
        const intervalBlack = setInterval(() => {
          setBlackTime(blackTime => blackTime>0?blackTime - 1:blackTime);
        }, 1000);
        return () => clearInterval(intervalBlack);
      }
      return;
    }, [ticking]);

    useEffect(() => {
      setWhiteTime(gameTimersWhite);
      setBlackTime(gameTimersBlack);
    },[ticking,gameTimersWhite, gameTimersBlack])

    useEffect(() => {
    },[whiteTime, blackTime])

    useEffect(() => {
      if(winner != "" && winner != null){
        setIsWinnerModalOpen(true);
        console.log(winner.winner)
        setWinnerName(winner.winner);
      }
    }, [winner])


  useEffect(()=>{
    dispatch(set_game_turn(""))
      dispatch(hub_join_group(props.match.params.gameRoomID));
  },[])

  const onMakeAMove = (moveString) => {
    dispatch(make_a_move(props.match.params.gameRoomID, moveString));
  }

  const getPlayerTurnFromMove = (moveString) =>
  {
    let startMove = moveString.substring(0,2);
    let finalMove = moveString.substring(3,5);
    let startStringPos = positionToStringPosition(startMove);
    let finalStringPos = positionToStringPosition(finalMove);

    return [startStringPos, finalStringPos];
  }

  const positionToStringPosition = (positionString) => {
    let column = positionString[0].toUpperCase().charCodeAt(0) - 64;
    let row = parseInt(positionString[1],10);
    return [column,row];
  }

  String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
  }

  const saveGame = () => {
    axios.post(global.BACKEND+"/userGames/",{    
      "gameID" : parseInt(props.match.params.gameRoomID)        
    },{
        headers:{
            "Authorization": "Bearer " + window.localStorage.getItem("access_token")
        }
    }).then((response)=>{
    }).catch((err)=>{
        console.log(err);
    })  
  }

    return(
        <>
            <div className={"gameroom"}>
              <ChessBoard serializedPassedBoard={unserializedChessBoard}
                          onMakeAMove={onMakeAMove}
                          playerOne={players.p1? players.p1: "no player joined"}
                          playerOneTime={whiteTime}
                          playerTwo={players.p2? players.p2: "no player joined"}
                          playerTwoTime={blackTime}
                          lastTurnMove={playersTurn?getPlayerTurnFromMove(playersTurn): [[],[]]}
                          reverse={localStorage.getItem("username")==players.p2?true:false}
                          />
            </div>
            <button onClick={()=>{saveGame()}}>Save game</button>
            <WinnerModal 
            open={isWinnerModalOpen} 
            onClose={()=>{setIsWinnerModalOpen(false)}}
            winnerName={winnerName}
            gameID={props.match.params.gameRoomID}
            />
        </>
    )
} 

export default GameRoom;