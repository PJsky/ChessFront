import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { useHistory } from 'react-router-dom';



const WinnerModal = ({open, winnerName, onClose, gameID, onRewatch}) => {
    const history = useHistory();
    if(!open) return null

    const Rewatch = () =>{
        console.log(onRewatch == null)
        if(onRewatch==null)
            history.push("/matchHistory/game/" + gameID)
        else
            onRewatch();
    }

    return (
        <>
          <div className={"newGameModal__overlay"}/>
          <div className={"newGameModal"}>
              <span className="newGameModal__close" onClick={onClose}>
                  <span className="newGameModal__closeButton"> 
                      X
                    </span>
                </span>    
                <span className="winnerModal__name">THE WINNER IS <br/> 
                    <span className="winnerModal__winner">{winnerName}</span>
                </span>
                <div className="winnerModal__buttons">
                    <button className="winnerModal__rewatch"
                            onClick={()=>{Rewatch()}}>
                                Rewatch
                    </button>
                    <button className="winnerModal__quit" 
                            onClick={()=>{history.push("/")}}>
                                Quit
                    </button>
                </div>
          </div>  
        </>
    )
}
export default WinnerModal