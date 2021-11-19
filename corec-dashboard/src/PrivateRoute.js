import { React, useState, useEffect } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import NotLoggedIn from "./NotLoggedIn";
import Header from "./Header";
import "./App.css";

function PrivateRoute({ ...props }) {
  const { component, path } = props;
  return localStorage.getItem("access") || sessionStorage.getItem("access") ? (
    <Route exact path={path} component={component} />
  ) : (
    <div>
      <Header />
      <NotLoggedIn />
    </div>
  );
}

export default PrivateRoute;
