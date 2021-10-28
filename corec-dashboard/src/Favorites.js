import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
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
