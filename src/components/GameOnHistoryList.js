import React from 'react'
import { useHistory } from "react-router-dom";
import axios from 'axios';

export const GameOnHistoryList = ({gameID, playerWhite, playerBlack, onClick, date}) => {
    
    const history = useHistory();
    const enterGame = () => {
            history.push("/MatchHistory/game/"+gameID)
        }

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hour = d.getHours(),
            minute = d.getMinutes().toString().length == 1? "0" + d.getMinutes(): d.getMinutes();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-') + " " + hour + ":" + minute ;
    }

    return (
        <>
            <div className="gameItem" onClick={()=>enterGame()}>
                <div className="gameItem__upper">
                    <span className="gameItem__playerWhite">P1: {playerWhite}</span>
                    <span className="gameItem__playerBlack">P2: {playerBlack}</span>                    
                </div>
                <div className="gameItem__lower">
                    <span className="gameItem__time">{formatDate(date)}</span>
                </div>
            </div>     
        </>
    )
}

export default GameOnHistoryList;