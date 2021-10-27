import {React, useEffect} from "react";
import {Route, Redirect} from "react-router-dom";
import "./App.css";

function PrivateRoute({ isLoggedIn, ...props}) {
  async function checkToken() {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: localStorage.getItem("access")
        }),
      };
      let response = await fetch("/auth", requestOptions);
      response = await response.json();
      console.log(response.status);
      return response.status == 'success';
  }
  return (
    checkToken()
    ? <Route {...props}/>
    : <Redirect to="/"/>
  )
}

export default PrivateRoute;