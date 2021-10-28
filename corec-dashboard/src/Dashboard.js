import { React, useEffect, useState } from "react";
import {
  Link,
  useHistory,
} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Header from "./Header";
import { Alert } from "react-bootstrap";
//import Star from "react-star-rating-component";
import Star from "./Star";

function Dashboard() {
  //const [rooms, setRooms] = useState([]);
  //const [user, setUser] = useState("");
  //const [showFavOnly, setShowFavOnly] = useState(false);
  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const [authError, setAuthError] = useState(false);

  const rooms = ["Room 1", "Room 2", "Room 3", "Room 4"];
  const history = useHistory();

  async function handleGetFavorites() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access: `${localStorage.getItem("access")}`,
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
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access: `${localStorage.getItem("access")}`,
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
    console.log(roomName);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access: `${localStorage.getItem("access")}`,
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

  function displayError() {
    if (authError) {
      return (
        <div>
          <Alert
            onClose={() => setAuthError(false)}
            dismissible
            show={authError}
            key={0}
            variant="danger"
          >
            <Alert.Heading>
              Oops! It seems like you're not logged in.
            </Alert.Heading>
            <p>
              You can <Alert.Link href="/">log in</Alert.Link> if you already
              have an account or{" "}
              <Alert.Link href="/signup">create an account</Alert.Link>.
            </p>
          </Alert>
        </div>
      );
    }
  }

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
        {/* {displayError()} */}

        {/* <Button
        block
        size="lg"
        type="submit"
        onClick={() => setShowFavOnly(false)}
        disabled={!showFavOnly}
      >
        Show all
      </Button> */}

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
