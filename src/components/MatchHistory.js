import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {GameOnHistoryList} from './GameOnHistoryList';

const MatchHistory = () => {
    const [listOfGames,setListOfGames] = useState([]);
    const history = useHistory();

    useEffect(()=>{
        axios.get(global.BACKEND + "/game/getMatchHistory",
        {
            headers:{
                "Authorization": "Bearer " + window.localStorage.getItem("access_token")
            }
        })
        .then((response)=>{
            console.log(response);
            setListOfGames(response.data);
        })
        // axios.get(global.BACKEND + "/userGames/",
        // {
        //     headers:{
        //         "Authorization": "Bearer " + window.localStorage.getItem("access_token")
        //     }
        // })
        // .then((response)=>{
        //     console.log(response);
        //     setListOfGames(response.data);
        // })
    },[])

    const renderListOfGames = () => {
        let renderedList = [];
        for(let i = 0;i< listOfGames.length; i++){
            let tempId = i;
            renderedList.push(
                <GameOnHistoryList key={i}
                 gameID={listOfGames[i].gameID} playerWhite={listOfGames[i].playerWhite} 
                 playerBlack={listOfGames[i].playerBlack} date={listOfGames[i].date}/>
                )
        }
        return renderedList;
    }

    return (
        <>
            <div className="gameList gameList__history">
                <div className="gameList__header">
                    <h1>Match history</h1>
                </div>
                <div className="gameItems">
                    {renderListOfGames()}
                </div>
            </div>
        </>
    )
} 

export default MatchHistory;