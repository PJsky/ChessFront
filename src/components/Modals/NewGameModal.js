import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import { useHistory } from 'react-router-dom';



const NewGameModal = ({open, children, onClose}) => {
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
              <div className={"newGameModal__form"}>
              <Formik
                initialValues={{ gameTime:'', timeGain:'' }}
                validateOnChange={false}
                onSubmit={(values, { setSubmitting }) => {
                    axios.post(global.BACKEND + "/game/addCustomGame", {
                        "gameTime": parseInt(values['gameTime']),
                        "timeGain": parseInt(values['timeGain'])
                    }, {
                        headers:{
                            "Authorization": "Bearer " + window.localStorage.getItem("access_token")
                        }
                    }).then((response)=>{
                        setSubmitting(false);
                        let newGameID = response.data.gameID;
                        history.push("/gameroom/"+newGameID);
                    }).catch((error)=>{
                        alert("Use numbers to indicate time");
                        setSubmitting(false);
                    })
                }}
                >
                {({ isSubmitting, errors }) => (
                    <Form>
                        <Field type="text" placeholder="Starting Time (s)" name="gameTime" id="gameTime"/>
                        <Field type="text" placeholder="Time Gain (s)" name="timeGain" id="timeGain"/>
                        <button type="submit" disabled={isSubmitting}>
                            Create
                        </button>
                    </Form>
                )}
                </Formik>
              </div>
          </div>  
        </>
    )
}
export default NewGameModal