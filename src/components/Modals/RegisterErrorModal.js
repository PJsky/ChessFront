import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { useHistory } from 'react-router-dom';



const RegisterErrorModal = ({open, onClose}) => {
    const history = useHistory();
    if(!open) return null

    return (
        <>
          <div className={"newGameModal__overlay"}/>
          <div className={"newGameModal"}>
              <span className="newGameModal__close" onClick={onClose}>
                  <span className="newGameModal__closeButton"> 
                      X
                    </span>
                </span>    
                <span className="winnerModal__name">
                    Account name already taken
                </span>
                <div className="winnerModal__buttons">
                    <button className="winnerModal__rewatch"
                            onClick={onClose}>
                                OK
                    </button>

                </div>
          </div>  
        </>
    )
}
export default RegisterErrorModal