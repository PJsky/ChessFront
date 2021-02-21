import axios from 'axios'
import React from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import {Avatar} from "@material-ui/core";



const PersonOnList = ({name, game, userID}) => {
    let history = useHistory();

    const AddFriend = (friendID) => {
        axios.post(global.BACKEND + "/friend/addFriend", {
            "userID": friendID,
        }, {
            headers:{
                "Authorization": "Bearer " + window.localStorage.getItem("access_token")
            }
        }).then((response)=>{
            alert("Successfully sent request")
        }).catch((error)=>{
            alert("Something failed when trying to add him to friends");
        })
    }

    const renderButton = () =>{
        if(game == null)
        return (
            <button className="friend__button--disabled">
                Spectate
            </button>
        )
        return (
            <button onClick={()=>{if(game)history.push("/gameroom/"+game)}}>
                Spectate
            </button>
        )
        
    }

    return (
        <div className="friend">
            <div className="friend__upper">
                <div className="friend__identification">
                <Avatar/>
                <span className="friend__name">
                    {name} 
                </span>
                </div>
                <span className="friend__spectate">
                {renderButton()}
                </span>
            </div>
        </div>
    )
}

export default PersonOnList
