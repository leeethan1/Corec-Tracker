import {React, useState, useEffect} from "react";
import {Route, Redirect, useHistory} from "react-router-dom";
import "./App.css";

function PrivateRoute({status, ...props}) {
  // const [status, setStatus] = useState(false);
  // const history = useHistory();
  // useEffect(() => {
  //   if (localStorage.getItem("access")) {
  //     const requestOptions = {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         token: localStorage.getItem("access")
  //       }),
  //     };
  //     fetch("/auth", requestOptions).
  //     then(res => res.json())
  //     .then(response => {
  //       setStatus(response.status == 'success');
  //     })
  //   }
  // }, []);
  return (
    status
    ? <Route {...props}/>
    : <Redirect to="/"/>
  )
}

export default PrivateRoute;