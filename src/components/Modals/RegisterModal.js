import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { useHistory } from 'react-router-dom';



const RegisterModal = ({open, onClose}) => {
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
                    You have successfully created an account
                </span>
                <div className="winnerModal__buttons">
                    <button className="winnerModal__rewatch"
                            onClick={onClose}>
                                Continue
                    </button>

                </div>
          </div>  
        </>
    )
}
export default RegisterModal