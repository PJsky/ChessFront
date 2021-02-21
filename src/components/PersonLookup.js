import axios from 'axios'
import React, {useState, useEffect} from 'react'
import PersonOnList from './PersonOnList';

const PersonLookup = (props) => {
    const [listOfPeople, setListOfPeople] = useState([]);

    useEffect(()=>{
        setTimeout(function () {
            axios.get(global.BACKEND + "/friend/lookup/" + props.location.search,
            {
                headers:{
                    "Authorization": "Bearer " + window.localStorage.getItem("access_token")
                }
            })
            .then((response)=>{
                setListOfPeople(response.data);
            })
        }, 50);
    },[props])

    const renderFriends = (listOfFriends) => {
        let renderedList = [];
        for(let i = 0; i < listOfFriends.length; i++){
            renderedList.push(
                <PersonOnList name={listOfFriends[i].name} userID={listOfFriends[i].userID}/>
            )
        }
        return renderedList;
    }

    return (
        <div className="lookup__card">
           {renderFriends(listOfPeople)} 
        </div>
    )
}

export default PersonLookup

