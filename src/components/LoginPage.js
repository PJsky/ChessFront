import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { user_log_in, user_log_out } from '../actions/UserActions';
import { useHistory } from 'react-router-dom';
import LoginSchema from '../validationSchemas/LoginSchema';
import { Alarm, AlarmOnTwoTone } from '@material-ui/icons';
import ErrorModal from './Modals/LoginErrorModal';


const LoginPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isDataInvalid,setIsDataInvalid] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    return (
        <>
        <div className="loginPage">
            <div className="loginPage__input">
                <Formik
                initialValues={{ name:'', password:'' }}
                validationSchema={LoginSchema}
                validateOnChange={false}
                onSubmit={(values, { setSubmitting }) => {
                    axios.post(global.BACKEND + "/user/authenticate", {
                        "name": values['name'],
                        "password": values['password']
                    }).then((response)=>{
                        setSubmitting(false);
                        let token, username;
                        try{
                            token = response.data.token;
                        }catch{
                            token = "";
                        }
                        try{
                            username = response.data.username;
                        }catch{
                            username = "";
                        }
                        window.localStorage.setItem("access_token", token);
                        window.localStorage.setItem("username", username);
                        dispatch(user_log_in());
                        history.push('/');
                    }).catch((error)=>{
                        try{
                            window.localStorage.removeItem("access_token");
                            window.localStorage.removeItem("username");
                            dispatch(user_log_out());
                        }catch{}
                        //alert("Your login credentials don't match our data");
                        setIsErrorModalOpen(true);
                        setSubmitting(false);
                        setIsDataInvalid(true);
                    })
                }}
                >
                {({ isSubmitting, errors }) => (
                    <Form className="loginPage__form" 
                    onChange={()=>{setIsDataInvalid(false)}}>
                        <Field type="text" placeholder="Name" name="name" id="name"/>
                        <Field type="password" placeholder="Password" name="password" id="password"/>
                        <ErrorMessage name="name" component="div" />
                        <ErrorMessage name="password" component="div" />
                        <button type="submit" disabled={isSubmitting}>
                            Log in
                        </button>
                    </Form>
                )}
                </Formik>
                {/* <span className="loginPage__forgotten">Forgot Password?</span> */}
            </div>
            <hr/>
            <button onClick={()=>{history.push("/register")}}
            className="loginPage__CreateButton">Create New Account</button>
        </div>
        <ErrorModal open={isErrorModalOpen} onClose={()=>{setIsErrorModalOpen(false)}}/>
        </>
    )}

export default LoginPage
