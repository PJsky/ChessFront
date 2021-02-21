import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {Search, Home, Forum} from "@material-ui/icons";
import {Avatar, IconButton} from "@material-ui/core";
import {Event, History, Face, SportsKabaddi} from "@material-ui/icons";
import { useHistory, useLocation } from 'react-router-dom';
import {user_log_out} from '../actions/UserActions';
import {set_events} from '../actions/EventCommunicationActions';
import {hub_quit_group} from '../actions/GameHubActions';
import { Formik, Form, Field, ErrorMessage } from 'formik';


const Header = () => {
    const isLogged = useSelector(state => state.logged_in); 
    const events = useSelector(state => state.events); 
    const history = useHistory();
    let [location,setLocation] = useState(history.location.pathname.split("/")[1]); 
    console.log(location);  
    const dispatch = useDispatch();

    const changeLocation = (location) =>{
        history.push(location);
        setLocation(history.location.pathname.split("/")[1]);
    }

    const loc = useLocation();
    useEffect(()=>{
        console.log("loaction changed");
        setLocation(history.location.pathname.split("/")[1]);
        dispatch(hub_quit_group())
        if(location == "feed")
            dispatch(set_events(null));
    },[loc]) 

    if(isLogged)
    return (
        <div className="header">

            <div className="header__left">
                <div className="header__input">
                    {/* <Search/>
                    <input type="text" placeholder="Lookup Player"/> */}
                    <Formik
                initialValues={{ searchInput:'' }}
                validateOnChange={false}
                onSubmit={(values, { setSubmitting }) => {
                    history.push("/lookup?lookupName=" + values["searchInput"]);
                    setSubmitting(false);
                }}
                >
                {({ isSubmitting, errors }) => (
                    <Form>
                        <Search/>
                        <Field type="text" placeholder="Lookup Player" name="searchInput" id="searchInput"/>
                        {/* <button type="submit" disabled={isSubmitting}>
                            Search
                        </button> */}
                    </Form>
                )}
                </Formik>
                </div>
            </div>

            <div className="header__middle">
                <div onClick={()=>{changeLocation("/")}} 
                className={location == ""||location  == "login" || location == "register" ?"header__option header__option--active": "header__option"}>
                    <Home fontSize="large"/>
                    {/* <SportsKabaddi fontSize="large"/> */}
                </div>
                {/* <div onClick={()=>{changeLocation("/login")}}  
                className={location == "login"?"header__option header__option--active": "header__option"}>
                    <Home fontSize="large"/>
                </div>
                <div onClick={()=>{changeLocation("/register")}}
                className={location == "register"?"header__option header__option--active": "header__option"}>
                    <Home fontSize="large"/>
                </div> */}
                <div onClick={()=>{changeLocation("/matchhistory")}} 
                className={location == "matchhistory"?"header__option header__option--active": "header__option"}>
                    <History fontSize="large"/>
                </div>
                <div onClick={()=>{changeLocation("/friends")}} 
                className={location == "friends"?"header__option header__option--active": "header__option"}>
                    <Face fontSize="large"/>
                </div>
                <div onClick={()=>{changeLocation("/feed")}} 
                className={location == "feed"?"header__option header__option--active": "header__option"}>
                    <Event fontSize="large"/>
                    <span className={events != null?"header__notification":"header__notification--hidden"}>!</span>
                </div>
            </div>

            <div className="header__right">
                <div className="header__info">
                    <Avatar />
                    <h4>{isLogged?window.localStorage.getItem("username"):"not logged in"}</h4>
                    <h4 className={"header__logout"} onClick={()=>{dispatch(user_log_out()); history.push("/login")}}>LOGOUT</h4>
                    {/* <IconButton>
                        <Forum/>
                    </IconButton> */}
                </div>
            </div>
            
        </div>
    );
    else
    return(
        <div className="header">

            <div className="header__left">
                <div className="header__input">
                    <Search/>
                    <input type="text" placeholder="Lookup Player"/>
                </div>
            </div>

            <div className="header__middle">
                <div onClick={()=>{changeLocation("/login")}}  
                className={location == "login"|| location == "" || location == "matchhistory"?"header__option header__option--active": "header__option"}>
                    LOGIN
                </div>
                <div onClick={()=>{changeLocation("/register")}}
                className={location == "register"?"header__option header__option--active": "header__option"}>
                    REGISTER
                </div>
            </div>

            <div className="header__right">
                <div className="header__info">

                </div>
            </div>
            
        </div>
    );
}

export default Header;
