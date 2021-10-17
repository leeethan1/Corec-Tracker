import {React, useEffect, useState} from "react";
import {BrowserRouter as Router, Switch, Route, Link, useHistory} from "react-router-dom";
import Star from "./Star"
import { Button } from "react-bootstrap";

function Dashboard(props) {
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState("");
  const history = useHistory();

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

  function handleLogOut(res) {
    fetch("logout", {
      method: 'POST'
    })
    .then(res => res.json())
    .then((response) => {
      console.log(response)
    });
    history.push('/');
  }

  return (
    <div>
      <h1> Dashboard </h1>
      {renderRooms()}
      <Button onClick={handleLogOut}>Log out</Button>
    </div>
  );
}

export default Dashboard;