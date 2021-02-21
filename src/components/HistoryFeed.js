import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { string } from "yup";
import {GameOnList} from './GameOnList';
import NewGameModal from "./Modals/NewGameModal";
import SingleOnFeed from "./SingleOnFeed";

const MainPage = () => {
    const [textValue,setTextValue] = useState(window.localStorage.getItem("access_token"));
    const [historyList,setHistoryList] = useState([]);
    const history = useHistory();

    
      
    
    useEffect(()=>{
        setTimeout(function () {
            axios.get(global.BACKEND + "/friend/historyFeed",
            {
                headers:{
                    "Authorization": "Bearer " + window.localStorage.getItem("access_token")
                }
            })
            .then((response)=>{
                setHistoryList(response.data);
            })
        }, 50);
    },[])

    const renderFeed = () =>{
        let history = [];
        for(let i = 0; i < historyList.length; i++){
            history.push(
                // <div className="historyFeed__card">
                //     {renderSingle(historyList[i])}
                // </div>
                <SingleOnFeed key={i}
                              feedData={historyList[i]}
                              onClickRewatch={()=>{goRewatch(historyList[i].gameID)}}
                              onClickSpectate={()=>{goSpectate(historyList[i].gameID)}}/>
            )
        }
        return history;
    }

    const goRewatch = (gameID) => {
        history.push("/matchHistory/game/" + gameID);
    }

    const goSpectate = (gameID) => {
        history.push("/gameroom/" + gameID);
    }

    const renderSingle = (singleFeed) =>{
        let eventTime = singleFeed.eventTime;
        let gameID = singleFeed.gameID;
        let isStartEvent = singleFeed.isStartEvent;
        let playerWhite = singleFeed.playerWhite;
        let playerBlack = singleFeed.playerBlack;
        let wonBy = singleFeed.wonBy;
        let isGameLive = singleFeed.isGameLive;

        let elementToRender;
        if(isStartEvent){
            elementToRender = (
                <div onClick={()=>{if(isGameLive)history.push("/gameroom/"+gameID)}}>
                    The {playerWhite} has started a match against {playerBlack}
                </div>
            )
        }else{
            if(wonBy == playerWhite)
            elementToRender = (
                <div onClick={()=>{history.push("/MatchHistory/game/"+gameID)}}>
                    The {playerWhite} has beaten {playerBlack}
                </div>
            )
            else if(wonBy == playerBlack)
            elementToRender = (
                <div onClick={()=>history.push("/MatchHistory/game/"+gameID)}>
                    The {playerBlack} has beaten {playerWhite}
                </div>
            )
        }
        return elementToRender;
    }

    return (
        <>
            {/* <h2>Friends History Feed</h2> */}
            {/* <SingleOnFeed feedData={historyList[0]}/> */}
            {/* <div className="historyFeed__space"/> */}
            {renderFeed()}
        </>
    )
} 

export default MainPage;