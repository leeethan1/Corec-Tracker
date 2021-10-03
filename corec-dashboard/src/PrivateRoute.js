import React from "react";
import {Route, Redirect} from "react-router-dom";
import Login from "./Login"
import Dashboard from "./Dashboard";
import "./App.css";

function PrivateRoute({ isLoggedIn, ...props}) {
  return (
    isLoggedIn
    ? <Route {...props}/>
    : <Redirect to="/"/>
  )
}

export default PrivateRoute;