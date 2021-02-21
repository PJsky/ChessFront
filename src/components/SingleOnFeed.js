import { RssFeedTwoTone } from "@material-ui/icons";
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import {Avatar} from "@material-ui/core";


const SingleOnFeed = ({feedData , onClickSpectate, onClickRewatch}) => {
    
    let playerWhite = feedData != null? feedData.playerWhite : null;
    let playerBlack = feedData != null? feedData.playerBlack : null;
    let wonBy = feedData != null? feedData.wonBy : null;
    let isGameLive = feedData != null? feedData.isGameLive : null;
    let eventTime = feedData != null? new Date(feedData.eventTime) : null;

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

    const renderButton = () => {
        if(wonBy == null || wonBy == "")
        return (
            <button className={!isGameLive?"historyFeed__button--disabled":""}
            onClick={()=>{if(onClickSpectate != null && isGameLive)onClickSpectate()}}>Spectate</button>
        )
        
        return(
            <button onClick={()=>{if(onClickRewatch != null && wonBy != null && wonBy != "")onClickRewatch()}}>Rewatch</button>
        )
    }

    return (
        <div className="historyFeed__card">
            <div className="historyFeed__card__upper">
                <div className="historyFeed__playerOne">
                    <Avatar/>
                    <span className="historyFeed__playerTwo__name">
                        {playerWhite} 
                    </span>
                </div>
                <div className="historyFeed__playerTwo">
                    <Avatar/>
                    <span className={(wonBy==playerBlack?"historyFeed__winner ":" ") +("historyFeed__playerTwo__name ")}>
                        {playerBlack} 
                    </span>
                </div>

            </div>
            <div className="historyFeed__card__lower">
                <span className="historyFeed__date">
                    {wonBy == null || wonBy == ""?"Started on:":"Ended on:"} 
                    <br/>
                    {formatDate(eventTime)}
                </span>
                {renderButton()}
            </div>
        </div>
    )
}

export default SingleOnFeed
