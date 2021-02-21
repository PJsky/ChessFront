import axios from 'axios'
import React, {useState, useEffect} from 'react'
import RequestOnList from './RequestOnList';
import FriendOnList from './FriendOnList';

const FriendPanel = (props) => {
    const [listOfRequests, setListOfRequests] = useState([]);
    const [listOfFriends, setListOfFriends] = useState([]);
    const [isRequests, setIsRequests] = useState(true);

    useEffect(()=>{
        setTimeout(function () {
            //Get requests
            axios.get(global.BACKEND + "/friend/getFriendRequests/",
            {
                headers:{
                    "Authorization": "Bearer " + window.localStorage.getItem("access_token")
                }
            })
            .then((response)=>{
                setListOfRequests(response.data);
            })

            //Get friends
            axios.get(global.BACKEND + "/friend/getFriends/",
            {
                headers:{
                    "Authorization": "Bearer " + window.localStorage.getItem("access_token")
                }
            })
            .then((response)=>{
                setListOfFriends(response.data);
            })
        }, 50);
    },[props])

    const renderRequests = (listOfFriends) => {
        let renderedList = [];
        for(let i = 0; i < listOfFriends.length; i++){
            renderedList.push(
                <RequestOnList name={listOfFriends[i].name} userID={listOfFriends[i].userID}/>
            )
        }

        if(renderedList.length < 1){
            renderedList.push(
                <div className="friendPanel__noone">
                    You have no new friend requests
                </div>
            )
        }
        return renderedList;
    }

    const renderFriends = (listOfFriends) => {
        let renderedList = [];
        for(let i = 0; i < listOfFriends.length; i++){
            renderedList.push(
                <FriendOnList name={listOfFriends[i].name} userID={listOfFriends[i].userID} game={listOfFriends[i].gameID}/>
            )
        }

        if(renderedList.length < 1){
            renderedList.push(
                <div className="friendPanel__noone">
                    You have no friends added
                </div>
            )
        }
        return renderedList;
    }

    const handleCheckbox = (e) => {
        if(isRequests == false)setIsRequests(true);
        else setIsRequests(false);
    }

    return (
        <div className="friendPanel">
            <header className="friendPanel__upper">
                <button className={(isRequests?"friendPanel__button--active friendPanel__button":" friendPanel__button")  + " friendPanel__button--left"}
                onClick={()=>{setIsRequests(true)}}>
                    Requests
                </button>
                <button className={(!isRequests?"friendPanel__button--active friendPanel__button":" friendPanel__button") + " friendPanel__button--right"}
                onClick={()=>{setIsRequests(false)}}>
                    Friends
                </button>
            </header>
            <div className="firendPanel__lower">
                {isRequests?renderRequests(listOfRequests):renderFriends(listOfFriends)} 
            </div>
            {/* <input type="checkbox" checked={isRequests} onChange={(e) => {handleCheckbox(e)}}/> */}
        </div>
    )
}

export default FriendPanel;

