import { React, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Header from "./Header";
import { Alert, FormCheck, Spinner } from "react-bootstrap";
//import Star from "react-star-rating-component";
import Star from "./Star";
import { PieChart, Pie, Tooltip, Legend } from "recharts";

function Dashboard() {
  const [rooms, setRooms] = useState({
    "Room 1": 0,
    "Room 2": 0,
    "Room 3": 0,
    "Room 4": 0,
  });

  const graphData = Object.entries(rooms).map(([key, value], index) => {
    return {
      room: key,
      occupancy: value,
      fill: `#${parseInt(
        0xaf77f9 * ((index + 1) / Object.keys(rooms).length)
      ).toString(16)}`,
    };
  });

  //const [user, setUser] = useState("");
  //const [showFavOnly, setShowFavOnly] = useState(false);
  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const [authError, setAuthError] = useState(false);
  const [tick, setTick] = useState(0);
  const [sorted, setSorted] = useState(false);
  const [loading, setLoading] = useState(true);

  //const rooms = ["Room 1", "Room 2", "Room 3", "Room 4"];
  const history = useHistory();

  useEffect(() => {
    sortRooms();
  }, [sorted]);

  useEffect(() => {
    handleGetFavorites();
    getOccupancies();
  }, []);

  async function getOccupancies() {
    setLoading(true);
    await handleGetRecent();
    setLoading(false);
  }

  async function handleGetFavorites() {
    const token = localStorage.getItem("remember")
      ? localStorage.getItem("access")
      : sessionStorage.getItem("access");
    //console.log(token);
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

  function sortRooms() {
    let newRooms = {};
    if (sorted) {
      let sorted = Object.entries(rooms).sort((a, b) => a[1] - b[1]);
      //console.log("Sorted = " + sorted);
      for (var entry of sorted) {
        newRooms[entry[0]] = entry[1];
      }
    } else {
      newRooms = Object.keys(rooms)
        .sort()
        .reduce((obj, key) => {
          obj[key] = rooms[key];
          return obj;
        }, {});
    }
    setRooms(newRooms);
    //console.log("Sorted rooms " + newRooms);
  }

  async function handleGetRecent() {
    let newRooms = {};
    for (const [roomName, occupancy] of Object.entries(rooms)) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          room: roomName,
        }),
      };
      const response = await fetch(`/process-room`, requestOptions);
      if (response.ok) {
        const res = await response.json();
        //handleChangeRooms(roomName, res.occupancy);
        //let newRooms = Object.assign({}, rooms);
        newRooms[roomName] = res.occupancy;
        //setRooms(newRooms);
        //console.log(newRooms);
        //console.log(rooms);
      } else {
        const res = await response.json();
        console.log(res);
      }
    }
    //console.log(newRooms);
    setRooms(newRooms);
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

  //console.log(graphData);

  return (
    <div>
      <Header />
      <h1> Dashboard </h1>
      {loading ? (
        <center>
          <p>Fetching Occupancies...</p>
          <Spinner size="lg" animation="border" />
        </center>
      ) : (
        <div>
          <PieChart width={730} height={250}>
            <Pie data={graphData} dataKey="occupancy" nameKey="room" label />
            <Tooltip />
            <Legend height={36} />
          </PieChart>
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
      )}
    </div>
  );
}

export default Dashboard;