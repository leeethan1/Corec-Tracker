import {React, useEffect, useState} from "react";
import {BrowserRouter as Router, Switch, Route, Link, useHistory} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Star from "./Star"

function Dashboard(props) {
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState("");
  const [showFavOnly, setShowFavOnly] = useState(false);

  useEffect(() => {
    // setUser(props.location.state.user);
    // fetch(`/getrooms?u=${props.location.state.user}`)
    // .then(res => res.json())
    // .then((response) => {
    //   setRooms(response)
    // });
    setUser(props.location.state.user);
    setRooms(
      [
          {
            name: "Room 1",
            fav: false
          },
          {
            name: "Room 2",
            fav: true
          },
          {
            name: "Room 3",
            fav: true
          },
          {
            name: "Room 4",
            fav: false
          }
    ]);
  }, [])

  function changeRoomFav(name) {
    for (var i in rooms) {
      if (rooms[i].name == name) {
        rooms[i].fav = !rooms[i].fav;
      }
    }
  }

  function renderRooms() {
    let rowsToRender = []
      rooms.forEach((item) => {
        if (showFavOnly && !item.fav) {
          return;
        }
        rowsToRender.push(
          <div className="room-row" key={item.name}>
            <hr/>
            <Link
              to={{
                pathname: "/roompage",
                state: {item}
              }}
            >{item.name}</Link>
            <Star room={item.name} selected={item.fav} favChange={(name) => changeRoomFav(name)}/>
            <hr/>
          </div>
        )
      })
    return (
      rowsToRender
    )
  }

  return (
    <div>
      <h1> {user}'s Dashboard </h1>
      <Button block size="lg" type="submit" onClick={() => setShowFavOnly(true)} disabled={showFavOnly}>
        Show favorites only
      </Button>
      <Button block size="lg" type="submit" onClick={() => setShowFavOnly(false)} disabled={!showFavOnly}>
        Show all
      </Button>
      {renderRooms()}
    </div>
  );
}

export default Dashboard;