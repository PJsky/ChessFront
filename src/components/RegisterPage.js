import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { user_log_in, user_log_out } from '../actions/UserActions';
import { useHistory } from 'react-router-dom';
import RegisterSchema from '../validationSchemas/RegisterSchema';
import ErrorModal from './Modals/RegisterErrorModal';


const RegisterPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [isDataInvalid,setIsDataInvalid] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

    return (
        <div className="registerPage">
            <div className="registerPage__input">
                <Formik
                initialValues={{ name:'', password:'' }}
                validationSchema={RegisterSchema}
                validateOnChange={false}
                onSubmit={(values, { setSubmitting }) => {
                    axios.post(global.BACKEND + "/user/register", {
                        "name": values['name'],
                        "password": values['password']
                    }).then((response)=>{

                        //Account created
                        // alert("Account successfully created");

                        axios.post(global.BACKEND + "/user/authenticate", {
                            "name": values['name'],
                            "password": values['password']
                        })
                        .then((response) => {
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
                            // history.push('/');
                            history.push({
                                pathname: '/',
                                state: {
                                    isRegisterModalOpen: true
                                }
                            })
                        }).catch((error)=>{
                            try{
                                window.localStorage.removeItem("access_token");
                                window.localStorage.removeItem("username");
                                dispatch(user_log_out());
                            }catch{}
                            alert("Your register credentials don't match our data");
                            setSubmitting(false);
                            setIsDataInvalid(true);
                        })
                    }).catch((error)=>{
                        try{
                            window.localStorage.removeItem("access_token");
                            window.localStorage.removeItem("username");
                            dispatch(user_log_out());
                        }catch{}
                        // alert("Your register credentials don't match our data");
                        setIsErrorModalOpen(true);
                        setSubmitting(false);
                        setIsDataInvalid(true);
                    })
                }}
                >
                {({ isSubmitting, errors }) => (
                    <Form className="registerPage__form" 
                    onChange={()=>{setIsDataInvalid(false)}}>
                        <Field type="text" placeholder="Name" name="name" id="name"/>
                        <Field type="password" placeholder="Password" name="password" id="password"/>
                        <Field type="password" placeholder="PasswordConfirmation" name="passwordConfirmation" id="passwordConfirmation"/>
                        <ErrorMessage name="name" component="div" />
                        <ErrorMessage name="password" component="div" />
                        <ErrorMessage name="passwordConfirmation" component="div" />
                        {/* <button type="submit" disabled={isSubmitting}>
                            Log in
                        </button> */}
                        <button type="submit" disabled={isSubmitting}
                        className="registerPage__CreateButton">
                            Create Account
                        </button>
                    </Form>
                )}
                </Formik>
                {/* <span className="registerPage__forgotten">Forgot Password?</span> */}
            </div>
            <ErrorModal open={isErrorModalOpen} onClose={()=>{setIsErrorModalOpen(false)}}/>
        </div>

    )}

export default RegisterPage;
