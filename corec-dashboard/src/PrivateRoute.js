import React from "react";
import {Route, Redirect} from "react-router-dom";
import "./App.css";

function PrivateRoute({ isLoggedIn, ...props}) {
  return (
    isLoggedIn
    ? <Route {...props}/>
    : <Redirect to="/"/>
  )
}

export default PrivateRoute;