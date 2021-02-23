import './App.css';
import './style/style.css';
import MainPage from './components/MainPage';
import GameRoom from './components/GameRoom';
import ChessBoard from './components/ChessBoard/ChessBoard';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import MatchHistory from './components/MatchHistory';
import MatchHistoryGame from './components/MatchHistoryGame';
import {BrowserRouter as Router, Switch, Route, Redirect, useLocation} from 'react-router-dom';
import axios from 'axios';
import { user_log_in, user_log_out } from './actions/UserActions';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import PersonLookup from './components/PersonLookup';
import FriendPanel from './components/FriendPanel';
import HistoryFeed from './components/HistoryFeed';
import PrivateRoute from './components/NavigationHelper/PrivateRoute';

// global.BACKEND = "http://localhost:51463";
global.BACKEND = "https://pjskybackend.pl";


const App = () => {
  
  

  // let originalSet = localStorage.setItem;
  // localStorage.setItem = function(key, value) {
  //   var event = new Event('itemSet');
  //   event.value = value;
  //   event.key = key;
  //   originalSet.apply(this, arguments);
  //   document.dispatchEvent(event);
  // };
  const isLogged = useSelector(state => state.logged_in); 
  const dispatch = useDispatch();
  window.addEventListener("storage",()=>{IsLoggedIn()},false);
  window.onstorage = ()=>{IsLoggedIn()};
  
  useEffect(() => {
    IsLoggedIn();
  }, [])
  const IsLoggedIn = () =>{
    axios.get(global.BACKEND + "/user",{
      headers:{
        "Authorization" : "Bearer " + window.localStorage.getItem("access_token")
      }
    })
    .then((response)=>{
      console.log(response.data)
      let username = response.data.username;
      window.localStorage.setItem("username", username);

      dispatch(user_log_in());
    }).catch((error)=>{
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("username");
        dispatch(user_log_out());
    })
  }

  return (
    <Router>
      <div className="App">
        <Header/>
        <Switch>
          <Route path="/login" exact component={LoginPage}/>
          <Route path="/register" exact component={RegisterPage}/>
          <PrivateRoute path="/" exact component={MainPage}/>
          <PrivateRoute path="/gameRoom/:gameRoomID" exact component={GameRoom}/>
          <PrivateRoute path="/test" exact component={ChessBoard}/>
          <PrivateRoute path="/matchhistory" exact component={MatchHistory}/>
          <PrivateRoute path="/matchhistory/game/:gameID" exact component={MatchHistoryGame}/>
          <PrivateRoute path="/lookup/" exact component={PersonLookup}/>
          <PrivateRoute path="/friends/" exact component={FriendPanel}/>
          <PrivateRoute path="/feed/" exact component={HistoryFeed}/>
        </Switch>
      </div>
    </Router>
  );
}



export default App;
