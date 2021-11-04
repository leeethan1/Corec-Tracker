import { React, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Header from "./Header";
import { Alert } from "react-bootstrap";
//import Star from "react-star-rating-component";
import Star from "./Star";
import { rememberUser } from "./Login";

function Dashboard() {
  //const [rooms, setRooms] = useState([]);
  //const [user, setUser] = useState("");
  //const [showFavOnly, setShowFavOnly] = useState(false);
  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const [authError, setAuthError] = useState(false);

  const rooms = ["Room 1", "Room 2", "Room 3", "Room 4"];
  const history = useHistory();

  async function handleGetFavorites() {
    const token = localStorage.getItem("remember")
      ? localStorage.getItem("access")
      : sessionStorage.getItem("access");
    console.log(token);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access: token,
      },
    };
    const response = await fetch(`/favorites/get`, requestOptions);
    if (response.ok) {
      const res = await response.json();
      const o = res.rooms;
      //console.log(averages);
      setFavoriteRooms(o);
      //console.log(occupancies);
    } else if (response.status == 403) {
      setAuthError(true);
    }
  }

  function isSelected(room) {
    if (favoriteRooms.includes(room)) {
      return 1;
    }
    return 0;
  }

  async function handleAddFavorite(roomName) {
    const token = localStorage.getItem("remember")
      ? localStorage.getItem("access")
      : sessionStorage.getItem("access");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access: token,
      },
      body: JSON.stringify({
        room: roomName,
      }),
    };
    const response = await fetch(`/favorites/add`, requestOptions);
    if (response.ok) {
      const res = await response.json();
      setFavoriteRooms(res.rooms);
      console.log(favoriteRooms);
    } else {
      const res = await response.json();
      console.log(res);
    }
  }

  async function handleRemoveFavorite(roomName) {
    const token = localStorage.getItem("remember")
      ? localStorage.getItem("access")
      : sessionStorage.getItem("access");
    console.log(roomName);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access: token,
      },
      body: JSON.stringify({
        room: roomName,
      }),
    };
    const response = await fetch(`/favorites/remove`, requestOptions);
    if (response.ok) {
      const res = await response.json();
      setFavoriteRooms(res.rooms);
    }
  }

  useEffect(() => {
    handleGetFavorites();
  }, []);

  function changeRoomFav(name) {
    if (favoriteRooms.includes(name)) {
      handleRemoveFavorite(name);
    } else {
      handleAddFavorite(name);
    }
  }

  function renderStar(item) {
    //console.log(item);
    if (!authError) {
      return (
        <Star
          room={item}
          selected={favoriteRooms.includes(item)}
          favChange={() => changeRoomFav(item)}
        />
      );
    }
  }

  function renderRooms() {
    let rowsToRender = [];
    rooms.forEach((item) => {
      rowsToRender.push(
        <div className="room-row" key={item.name}>
          <hr />
          <Link
            to={{
              pathname: "/room/" + encodeURIComponent(item),
            }}
          >
            {item}
          </Link>
          {renderStar(item)}
          <hr />
        </div>
      );
    });
    return rowsToRender;
  }

  return (
    <div>
      <Header />
      <div style={{ margin: 10 }}>
        <h1> Dashboard </h1>
        {renderRooms()}
        <Button
          block
          size="lg"
          type="submit"
          onClick={() => history.push("/favorites")}
          disabled={authError}
        >
          Show favorites only
        </Button>
      </div>
    </div>
  );
}

export default Dashboard;
