import {React, useEffect, useState} from "react";
import {BrowserRouter as Router, Switch, Route, Link, useHistory} from "react-router-dom";
import Star from "./Star"

function Dashboard(props) {
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    // mock data - will use fetch call
    console.log("getting rooms");
    // fetch("/records/get")
    // .then(res => res.json())
    // .then((result) => {
    //   console.log(result);
    // })
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
    }
  , [])

  function renderRooms() {
    let rowsToRender = []
      rooms.forEach((item) => {
        rowsToRender.push(
          <div className="room-row" key={item.name}>
            <hr/>
            <Link
              to={{
                pathname: "/roompage",
                state: {item}
              }}
            >{item.name}</Link>
            <Star selected={item.fav}/>
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
      {renderRooms()}
    </div>
  );
}

export default Dashboard;