import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import {useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component, ...rest }) => {

  // Add your own authentication on the below line.
  const isLogged = useSelector(state => state.logged_in); 

  return (
    <Route
      {...rest}
      render={props =>
        isLogged ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  )
}

export default PrivateRoute