import axios from 'axios'
import { useEffect, useState } from 'react';
import * as signalr from '@aspnet/signalr';
import ChessBoard from './ChessBoard/ChessBoard';
import { useSelector } from 'react-redux';
import WinnerModal from './Modals/WinnerModal';


const MatchHistoryGame = (props) => {
  
    let [serializedBoard,setSerializedBoard] = useState("RNBQKBNRPPPPPPPP00000000000000000000000000000000pppppppprnbqkbnr");
    let gameID = props.match.params.gameID;
    let [piecesTaken,setPiecesTaken] = useState("");
    let [currentMoveStep, setCurrentMoveStep] = useState(0);
    let [movesList, setMovesList] = useState(0);
    let [playersTurn, setPlayersTurn] = useState("");
    let [reverse, setReverse] = useState(false);
    let [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
    let [players ,setPlayers] = useState([]);
    let [winnerName, setWinnerName] = useState("");

    const replayMove = (moveString) => {
        let startMove = moveString.substring(0,2);
        let finalMove = moveString.substring(3,5);
        let startStringPos = positionToStringPosition(startMove);
        let finalStringPos = positionToStringPosition(finalMove);
        setPiecesTaken(piecesTaken + serializedBoard[finalStringPos]);
        setSerializedBoard(serializedBoard.replaceAt(finalStringPos, serializedBoard[startStringPos]).replaceAt(startStringPos, '0'));
        // setSerializedBoard(serializedBoard.replaceAt(startStringPos, '0'));
    }

    const undoMove = (moveString) => {
        let startMove = moveString.substring(0,2);
        let finalMove = moveString.substring(3,5);
        let startStringPos = positionToStringPosition(startMove);
        let finalStringPos = positionToStringPosition(finalMove);
        setSerializedBoard(serializedBoard.replaceAt(startStringPos, serializedBoard[finalStringPos]).replaceAt(finalStringPos, piecesTaken[piecesTaken.length-1]));
        setPiecesTaken(piecesTaken.substring(0,piecesTaken.length-1));
    }

    String.prototype.replaceAt = function(index, replacement) {
        return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    }

    const positionToStringPosition = (positionString) => {
        let column = positionString[0].toUpperCase().charCodeAt(0) - 64;
        let row = parseInt(positionString[1],10);
        let columnValue = (1 * column) - 1;
        let rowValue = (8 * row) - 8;
        return columnValue+rowValue;
    }

    const nextMove = () =>{
        if(currentMoveStep >= movesList.length-1){
            endMatch();
            return ;
        }

        replayMove(movesList[currentMoveStep]);
        setPlayersTurn(getPlayerTurnFromMove(movesList[currentMoveStep]))
        setCurrentMoveStep(currentMoveStep+1);

        if(currentMoveStep >= movesList.length-2)endMatch();
    }

    const prevMove = () =>{
        if(currentMoveStep <= 0) return;

        undoMove(movesList[currentMoveStep-1]);
        if(currentMoveStep-2 >= 0)
            setPlayersTurn(getPlayerTurnFromMove(movesList[currentMoveStep-2]))
        else
            setPlayersTurn([[],[]])
        setCurrentMoveStep(currentMoveStep-1);
    }

    const getPlayerTurnFromMove = (moveString) =>
    {
        let startMove = moveString.substring(0,2);
        let finalMove = moveString.substring(3,5);
        let startStringPos = moveStringToPosition(startMove);
        let finalStringPos = moveStringToPosition(finalMove);

        return [startStringPos, finalStringPos];
    }

    const moveStringToPosition = (positionString) => {
        let column = positionString[0].toUpperCase().charCodeAt(0) - 64;
        let row = parseInt(positionString[1],10);
        return [column,row];
    }


    useEffect(()=>{
        axios.get(global.BACKEND + "/game/getGame/" + gameID)
        .then((response)=>{
            console.log(response.data)
            setPlayers([response.data.playerWhite, response.data.playerBlack]);
            setMovesList(response.data.movesList.split(";"));
            if(response.data.playerBlack == localStorage.getItem("username"))setReverse(true);
        }).catch((err) => {
            console.log(err);
        })
    },[])

    const onRewatch = () =>{
        setIsWinnerModalOpen(false);
        setCurrentMoveStep(0);
        setSerializedBoard("RNBQKBNRPPPPPPPP00000000000000000000000000000000pppppppprnbqkbnr");
        setPlayersTurn("");
    }

    const endMatch = () => {
        setIsWinnerModalOpen(true);
        if(currentMoveStep % 2 == 0) setWinnerName(players[1]);
        else setWinnerName(players[0]);
    }

    return(
        <>
            <div className={"gameroom"}>
              <ChessBoard serializedPassedBoard={serializedBoard}
                          lastTurnMove={playersTurn?playersTurn: [[],[]]}
                          playerOne={players[0]}
                          playerTwo={players[1]}              
                          reverse={reverse}
                          isReplay={true}
                          next={nextMove}
                          previous={prevMove}
                          step={currentMoveStep}
                          />
            </div>
            {/* <div>
                <button onClick={()=>{prevMove()}}>prev</button>
                <button onClick={()=>{nextMove()}}>next</button>
            </div> */}
            <WinnerModal 
            open={isWinnerModalOpen}
            onClose={()=>{setIsWinnerModalOpen(false)}}
            winnerName={winnerName}
            gameID={gameID}
            onRewatch={onRewatch}/>
        </>
    )
} 

export default MatchHistoryGame;