import { React, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Header from "./Header";
import { Alert, FormCheck } from "react-bootstrap";
//import Star from "react-star-rating-component";
import Star from "./Star";

function Dashboard() {
  const [rooms, setRooms] = useState({
    "Room 1": 0,
    "Room 2": 0,
    "Room 3": 0,
    "Room 4": 0,
  });
  //const [user, setUser] = useState("");
  //const [showFavOnly, setShowFavOnly] = useState(false);
  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const [authError, setAuthError] = useState(false);
  const [tick, setTick] = useState(0);
  const [sorted, setSorted] = useState(false);

  //const rooms = ["Room 1", "Room 2", "Room 3", "Room 4"];
  const history = useHistory();

  useEffect(() => {
    let interval = null;
    //console.log(tick);
    interval = setInterval(() => {
      setTick((tick) => tick + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    Object.keys(rooms).forEach((room) => {
      handleGetRecent(room);
    });
  }, [tick, sorted]);

  async function handleGetFavorites() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access": localStorage.getItem("access"),
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

  async function handleGetRecent(roomName) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access: `${localStorage.getItem("access")}`,
      },
      body: JSON.stringify({
        room: roomName.toLowerCase(),
      }),
    };
    const response = await fetch(`/process-room`, requestOptions);
    if (response.ok) {
      const res = await response.json();
      let newRooms = Object.assign({}, rooms);
      newRooms[roomName] = res.occupancy;
      if (sorted) {
        newRooms = Object.entries(rooms)
          .sort(([, a], [, b]) => a - b)
          .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
      } else {
        newRooms = Object.keys(rooms)
          .sort()
          .reduce((obj, key) => {
            obj[key] = rooms[key];
            return obj;
          }, {});
      }
      console.log(newRooms);
      setRooms(newRooms);
    } else {
      const res = await response.json();
      console.log(res);
    }
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

  function changeRoomFav(name) {
    if (favoriteRooms.includes(name)) {
      handleRemoveFavorite(name);
    } else {
      handleAddFavorite(name);
    }
  }

  function renderStar(item) {
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
    Object.keys(rooms).forEach((item) => {
      rowsToRender.push(
        <div className="room-row" key={item}>
          <hr />
          <Link
            to={{
              pathname: "/room/" + encodeURIComponent(item),
            }}
          >
            <h3>{item}</h3>
          </Link>
          {renderStar(item)}
          <p>Most recent occupancy: {rooms[item]}</p>
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
        <FormCheck
          type="switch"
          label={<p>Sort by Occupancy</p>}
          onChange={() => setSorted(!sorted)}
          checked={sorted}
        />
      </div>
    </div>
  );
}

export default Dashboard;