import { InfoTwoTone } from "@material-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {Avatar} from "@material-ui/core";

const ChessBoard = ({serializedPassedBoard, onMakeAMove,
    playerOne, playerTwo,
    playerOneTime, playerTwoTime,
     lastTurnMove, reverse, isReplay,
    next, previous, step}) => {
   const [highlightedPostion, setHighlightedPosition] = useState([]);
   const [piecePickedUp, setPiecePickedUp] = useState(null);
   let serializedBoard = "RNBQKBNRPPPPPPPP00000000000000000000000000000000pppppppprnbqkbnr";
   let isReverse = reverse!=null?reverse:false;
   if(serializedPassedBoard != null) 
      serializedBoard = serializedPassedBoard;


   const serializeBoard = (serializedBoard) =>{
      let serializedArr = [];
      for(let i = 1; i<=8;i++){
      serializedArr[i-1] = serializedBoard.slice((i*8)-8,(i*8));
      }
      return serializedArr;
   } 
   
   const serializedArrayBoard = serializeBoard(serializedBoard);

   const getChessPieces = () =>{
      let chessPieces = [];
      for(let i = 0; i < 8; i++){
         let row = serializedArrayBoard[i];
         for(let j = 0; j < 8; j++){
            let pieceCharacter = row[j];
            chessPieces.push(getChessPiece(pieceCharacter, j+1, i+1));
         }
      }
      return chessPieces;
   }


   const getChessPiece = (pieceCharacter, column, row) =>{
      let chessPieceClass = "";
      switch(pieceCharacter){
         case "p":
            chessPieceClass = "bp";
            break;
         case "P":
            chessPieceClass = "wp";
            break;
         case "r":
            chessPieceClass = "br";
            break;
         case "R":
            chessPieceClass = "wr";
            break;
         case "n":
            chessPieceClass = "bn";
            break;
         case "N":
            chessPieceClass = "wn";
            break;
         case "b":
            chessPieceClass = "bb";
            break;
         case "B":
            chessPieceClass = "wb";
            break;
         case "q":
            chessPieceClass = "bq";
            break;
         case "Q":
            chessPieceClass = "wq";
            break;
         case "k":
            chessPieceClass = "bk";
            break;
         case "K":
            chessPieceClass = "wk";
            break;
         case "0":
            chessPieceClass = "emptySpace";
            break;
         default:
            chessPieceClass = "emptySpace";
            break;
      }
      let chessPiecePositionClass = "cpPositon" + column + row;
      if(isReverse)
         chessPiecePositionClass = "cpPositon" + Math.abs(9-column) + Math.abs(9-row);
      let chessPiece = (<div 
         className={chessPieceClass +  " chessPiece " + getHighlightedClass(column, row) + getLastMoveClass(column, row) + chessPiecePositionClass}
         draggable={pieceCharacter!="0"?true:false}
         onDragStart={(e)=>{setPiecePickedUp(e.target)}}
         onDragEnter={(e)=>{hightlightTargetPositon(e)}} 
         onDragEnd={(e)=>{makeAMove()}}
         />)
      return chessPiece
   }

   const getHighlightedClass = (column, row) =>{
      if(highlightedPostion[0] == column && highlightedPostion[1] == row)
         return " highlighted-position ";
      return "";
   }

   const getLastMoveClass = (column, row) =>{
      try{
      if((lastTurnMove[0][0] == column && lastTurnMove[0][1] == row) || (lastTurnMove[1][0] == column && lastTurnMove[1][1] == row))
         return " lastmove-highlighted-position ";
      }catch{}
      return "";
   }

   const hightlightTargetPositon = (e) => {
      let cName = e.target.className;
      let column = cName[cName.length-2]
      let row = cName[cName.length-1]
      if(isReverse){
         column = Math.abs(9-column);
         row = Math.abs(9-row);
      }
      //Highlight only when u try to pick up chess piece not empty space
      if(!piecePickedUp.classList.contains("emptySpace"))
         setHighlightedPosition([column,row])
   }

   const getPickedUpPosition = () => {
      let cName = piecePickedUp.className;
      let column = cName[cName.length-2]
      let row = cName[cName.length-1]
      if(isReverse){
         column = Math.abs(9-column);
         row = Math.abs(9-row);
      }
      return [column,row];
   }

   const makeAMove = () => {
      let pickedUpPosition = getPickedUpPosition();

      let startColumnChar = String.fromCharCode(+64 + +pickedUpPosition[0])
      let startRowChar = pickedUpPosition[1];

      let finalColumnChar = String.fromCharCode(+64 + +highlightedPostion[0]);
      let finalRowChar = highlightedPostion[1];
      let moveString = startColumnChar+startRowChar+":"+finalColumnChar+finalRowChar;
      console.log(moveString);
      try{
         onMakeAMove(moveString);
      }catch(e){
         //console.log("no makeAMove callback function passed");
      }
      stopHighlighting();
   }

   const stopHighlighting = () => {
      setHighlightedPosition("");
   }

   useEffect(()=>{
      let chessBoard = document.querySelector("#chessBoard");
      new ResizeObserver(()=>{
         let chessPieces =  [].slice.call(document.querySelectorAll('.chessPiece'));
         chessPieces.map((cp)=>{
            cp.style.width = chessBoard.offsetWidth/8 + "px";
            cp.style.height = chessBoard.offsetHeight/8 + "px";
            return cp;
         })
      }).observe(chessBoard);
   },[])

   const dragOverBoard = (e) =>{
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
   }

   const getDisplayedTime = (time) =>{
      if(time == null) return "0:00"
      let minutes = parseInt((time/60)).toString();
      let seconds = (time%60).toString();
      seconds = seconds.length == 1? "0" + seconds : seconds;

      return minutes + ":" + seconds;
   } 

   const renderWhite = () => {
      return(
         <div className="chessBoard__playerOne">
            <span className="chessBoard__playerOne__Name">
               <Avatar className="chessBoard__avatar"/>
               {playerOne}
            </span>
            <span className={(isReplay?"global__hidden ": " " )+("chessBoard__playerOne__Time")}>
               {getDisplayedTime(playerOneTime)}
               </span>   
         </div>
      )
   }

   const renderBlack = () => {
      return(
         <div className="chessBoard__playerTwo">
            <span className="chessBoard__playerTwo__Name">
               <Avatar className="chessBoard__avatar"/>
               {playerTwo}
            </span>
            <span className={(isReplay?"global__hidden ": " " )+("chessBoard__playerTwo__Time")}>{getDisplayedTime(playerTwoTime)}</span>   
         </div>
      )
   }

   const renderReplay = () => {
      if(isReplay)
      return(
         <div className="chessBoard-Replay">
            <button onClick={next}>+</button>
            <div>{step}</div>
            <button onClick={previous}>-</button>
         </div>
      )
   }


   return(
      <>
      {isReverse?renderWhite():renderBlack()}
      <div className="chessBoard__vicinity">
         <div className="chessBoard-Container">
            <div id="chessBoard" onDragOver={(e) => {dragOverBoard(e)}}>
               {getChessPieces()}
            </div>
         </div>
         {renderReplay()}
      </div>
      {isReverse?renderBlack():renderWhite()}
      </>
   )
} 

export default ChessBoard;