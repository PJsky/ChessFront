import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {GameOnList} from './GameOnList';
import NewGameModal from "./Modals/NewGameModal";
import RegisterModal from "./Modals/RegisterModal";

const MainPage = () => {
    const [textValue,setTextValue] = useState(window.localStorage.getItem("access_token"));
    const [listOfGames,setListOfGames] = useState([]);
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [isRegisterModalOpen,setIsRegisterModalOpen] = useState(false);
    const history = useHistory();
    const location = useLocation();
    
      
    
    useEffect(()=>{
        setTimeout(function () {
            axios.get(global.BACKEND + "/game/getFreeGames",
            {
                headers:{
                    "Authorization": "Bearer " + window.localStorage.getItem("access_token")
                }
            })
            .then((response)=>{
                setListOfGames(response.data);
            })
        }, 50);

        if(location.state != null && location.state.isRegisterModalOpen != null)
            setIsRegisterModalOpen(location.state.isRegisterModalOpen)
    },[])

    const enterGame = (id) => {
        history.push("/gameroom/"+id);
    }

    const renderListOfGames = () => {
        let renderedList = [];
        for(let i = 0;i< listOfGames.length; i++){
            let tempId = i;
            renderedList.push(
                <GameOnList key={i}
                 gameID={listOfGames[i].gameID} playerWhite={listOfGames[i].playerWhite} playerBlack={listOfGames[i].playerBlack}
                 gameTime={listOfGames[i].gameTime} timeGain={listOfGames[i].timeGain}/>
                )
        }
        return renderedList;
    }

    const createNewGame = () =>{
        axios.post(global.BACKEND+"/game/addGame",{            
        },{
            headers:{
                "Authorization": "Bearer " + window.localStorage.getItem("access_token")
            }
        }).then((response)=>{
            let newGameID = response.data.gameID;
            history.push("/gameroom/"+newGameID);
        }).catch((err)=>{
            console.log(err);
        })    
    }


    return (
        <>
            <div className="mainPage__header">
                {/* <h1>This is main page</h1> */}
                {/* <button onClick={()=>{createNewGame()}}>+ New Game</button> */}
                <button onClick={()=>setIsModalOpen(true)}>+ New Game</button>
            </div>
            <div className="gameList">
                <div className="gameList__header">
                    <h1>Games</h1>
                </div>
                <div className="gameItems">
                    {renderListOfGames()}
                </div>
            </div>
            <div>
                <NewGameModal open={isModalOpen}
                onClose={()=>setIsModalOpen(false)}>
                    New Modal here
                </NewGameModal>
                <RegisterModal open={isRegisterModalOpen} onClose={()=>{setIsRegisterModalOpen(false)}}/>
            </div>
        </>
    )
} 

export default MainPage;