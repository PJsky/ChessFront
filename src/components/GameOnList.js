import React from 'react'
import { useHistory } from "react-router-dom";
import axios from 'axios';

export const GameOnList = ({gameID, playerWhite, playerBlack, onClick, gameTime, timeGain}) => {
    
    const history = useHistory();
    const enterGame = () => {
            axios.post(global.BACKEND + "/game/joinGame",{
                "gameID": gameID
            }, {
                headers:{
                    "Authorization": "Bearer " + window.localStorage.getItem("access_token")
                }
            }).then((response)=>{
                history.push("/gameroom/"+gameID)
            }).catch((err)=>{
                console.log(err);
            })
        }

        const renderLower = () =>{
            console.log(gameTime)
            if(gameTime == null && timeGain == null)return;
            return(
                <div className="gameItem__lower">
                        <span className="gameItem__time">{secToMin(gameTime)} (+{timeGain})</span>                    
                </div>
            )
        }

        const secToMin = (sec) =>{
            if(sec == null) return "0:00"
            let minutes = parseInt((sec/60)).toString();
            let seconds = (sec%60).toString();
            seconds = seconds.length == 1? "0" + seconds : seconds;
      
            return minutes + ":" + seconds;
        } 
    
    return (
        <>
            {/* <div className="gameItem" onClick={()=>enterGame()}>
                <span className="gameItem__gameID">GameID: {gameID}</span>
                <span className="gameItem__playerWhite">P1: {playerWhite}</span>
                <span className="gameItem__playerBlack">P2: {playerBlack}</span>
            </div>      */}
            <div className="gameItem" onClick={()=>enterGame()}>
                <div className="gameItem__upper">
                    <span className="gameItem__playerWhite">P1: {playerWhite}</span>
                    <span className="gameItem__playerBlack">P2: {playerBlack}</span>                    
                </div>
                {renderLower()}
            </div>     
        </>
    )
}

export default GameOnList;