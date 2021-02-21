import axios from 'axios'
import React from 'react'
import {Avatar} from "@material-ui/core";


const PersonOnList = ({name, userID}) => {

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
        return (
            <button onClick={()=>{AddFriend(userID)}}>
                Add
            </button>
        )
        
    }

    return (
        // <div className="person" onClick={()=>{
        //     AddFriend(userID)
        //     }}>
        //     <h4>Persons name: {name}</h4>
        // </div>
        <div className="person">
            <div className="person__upper">
                <div className="person__identification">
                <Avatar/>
                <span className="person__name">
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
