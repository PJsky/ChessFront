import axios from 'axios'
import React from 'react'
import {Avatar} from "@material-ui/core";

const PersonOnList = ({name, userID}) => {

    const RespondToFriendRequest = (friendID, response) => {
        axios.post(global.BACKEND + "/friend/respondToInvitation", {
            "userID": friendID,
            "IsAccepted": response
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

    const renderButtons = () =>{
        return (
            <>
                <button className="friend__accept"
                onClick={()=>{RespondToFriendRequest(userID, true)}}>
                    Accept
                </button>
                <button className="friend__reject"
                onClick={()=>{RespondToFriendRequest(userID, false)}}>
                    Reject
                </button>
            </>
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
                <span className="friend__response">
                {renderButtons()}

                </span>
            </div>
        </div>
    )
}

export default PersonOnList
