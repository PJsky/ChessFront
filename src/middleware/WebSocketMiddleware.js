import * as SignalR from '@aspnet/signalr';
import { useDispatch } from 'react-redux';

export const WebsocketMiddleware = (store) =>{
    console.log(global.BACKEND)
    let socket = setupSocket(store);


    return function(next) {
        console.log("NEXT: " + next);
        
        return function(action){
            //Can switch it to switch later
            if(action.type == "HUB_SEND_MESSAGE"){
                socket.invoke("SendMessageToAll", action.payload).catch((e) =>{
                    return console.log(e);
                });
            }
            if(action.type == "HUB_JOIN_GROUP"){
                socket.invoke("JoinGameGroup", action.payload).catch(e => {
                    console.error(e.toString());
                    let retryConnection = setTimeout(() => {
                        let connectionSuccess = false;
                        console.log("trying again to connect to signalR");
                        socket.invoke("JoinGameGroup", action.payload).then(()=>{
                            connectionSuccess = true;
                        }).catch(e => {
                            console.log("trying to connect...");
                        });
                        if(connectionSuccess)
                            clearTimeout(retryConnection);
                    },1000)
                });
            }
            if(action.type == "HUB_QUIT_GROUP"){
                console.log("quit_groups");
                socket.invoke("QuitGroups").catch(e => {
                    return console.error(e.toString());
                });
            }
            if(action.type == "MAKE_A_MOVE"){
                // console.log("group: "+ action.group + " , moveString: " + action.payload)
                socket.invoke("SendMessageToGroup",action.group , action.payload)
                .then(()=>
                {
                    console.log("Send to :"+ action.group + " ,a message:" + action.payload );
                })
                .catch((err)=>{
                    console.log(err);
                })                
            }
            if(action.type == "LOG_OUT" || action.type == "LOG_IN"){
                socket = setupSocket(store)
            }

            next(action);
        }
    }

}

const setupSocket = (store) => {
    let socket = new SignalR.HubConnectionBuilder()
    .withUrl(global.BACKEND + "/GameHub", {
        accessTokenFactory: () => window.localStorage.getItem("access_token")
        })
    .build();
    
    socket.on("ReceiveMessage", (message)=>{
        console.log(message);
    })

    socket.on("ReceiveWinner", (winner)=>{
        console.log(winner);
        store.dispatch({
            type: "SET_GAME_WINNER",
            payload: winner
        })
    })

    socket.on("ReceiveBoard", (serializedBoard) => {
        store.dispatch({
            type: "SET_CHESSBOARD",
            payload: serializedBoard
        });
      })

    socket.on("ReceivePlayers", (players) => {
        store.dispatch({
            type: "SET_GAME_PLAYERS",
            payload: players
        });
    })

    socket.on("ReceiveTurn", (turn) => {
        console.log(turn);
        store.dispatch({
            type: "SET_GAME_TURN",
            payload: turn.lastTurnMove
        })
    })

    socket.on("ReceiveTime", (timers) => {
        console.log(timers)
        store.dispatch({
            type: "SET_GAME_TIMERS",
            payload: timers
        })
    })

    socket.on("ReceiveEvent", (eventData) => {
        console.log(eventData);
        store.dispatch({
            type: "SET_EVENTS",
            payload: eventData
        })
    })

    socket.start().catch(function(err){
        return console.error(err.toString());
    });

    return socket;
}