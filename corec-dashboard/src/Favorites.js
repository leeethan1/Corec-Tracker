import { React, useCallback, useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "./Login";
import Roompage from "./Roompage";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import VerifyAccount from "./VerifyAccount";
import ForgotPassword from "./ForgotPassword";
import PasswordResetEmailSent from "./PasswordResetEmailSent";
import ResetPassword from "./ResetPassword";
import Settings from "./Settings";
import Header from "./Header";
import { Alert } from "react-bootstrap";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function Favorites() {
  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const [authError, setAuthError] = useState(false);

  async function handleGetFavorites() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access: localStorage.getItem("access"),
      },
    };
    const response = await fetch(`/favorites/get`, requestOptions);
    if (response.ok) {
      const res = await response.json();
      const o = res.rooms;
      //console.log(averages);
      setFavoriteRooms(o);
      //console.log(occupancies);
    } else {
      setAuthError(true);
    }
  }

  useEffect(() => {
    handleGetFavorites();
  }, []);

  function displayFavoriteRooms() {
    if (favoriteRooms.length > 0) {
      let rowsToRender = [];
      favoriteRooms.forEach((item) => {
        rowsToRender.push(
          <div className="room-row" key={item}>
            <hr />
            <Link
              to={{
                pathname: "/room/" + encodeURIComponent(item),
              }}
            >
              {item}
            </Link>
            <hr />
          </div>
        );
      });
      return rowsToRender;
    } else {
      return <h3>Looks like you don't have any favorite rooms yet</h3>;
    }
  }

  return (
    <div>
      <Header />
      <div style={{ margin: 10 }}>
        <h1>Favorite Rooms</h1>
        {displayFavoriteRooms()}
      </div>
    </div>
  );
}

export default Favorites;
