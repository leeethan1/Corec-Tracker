import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link, useParams } from "react-router-dom";
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { GoogleLogout } from "react-google-login";
import Header from "./Header";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

const cID =
  "608867787381-cvgulq19nomsanr5b3ho6i2kr1ikocbs.apps.googleusercontent.com";

function Roompage() {
  const [occupancies, setOccupancies] = useState([]);

  const [liveOccupancy, setLiveOccupancy] = useState(0)

  //we probably need to have separate graphs for each room
  const [graphs, setGraphs] = useState([]);

  const {roomNumber} = useParams();

  //for now we'll separate by time
  //but in the future we'll have to separate by time
  //and have different graphs for each day of the week
  // const [graphData, setGraphData] = useState([
  //   {
  //     time: "Sun",
  //     ct: occupancies[0],
  //   },
  //   {
  //     time: "Mon",
  //     ct: occupancies[1],
  //   },
  //   {
  //     time: "Tue",
  //     ct: occupancies[2],
  //   },
  //   {
  //     time: "Wed",
  //     ct: occupancies[3],
  //   },
  //   {
  //     time: "Thu",
  //     ct: occupancies[4],
  //   },
  //   {
  //     time: "Fri",
  //     ct: occupancies[5],
  //   },
  //   {
  //     time: "Sat",
  //     ct: occupancies[6],
  //   },
  // ]);
  const graphData = [
    {
      time: "Sun",
      ct: occupancies[0],
    },
    {
      time: "Mon",
      ct: occupancies[1],
    },
    {
      time: "Tue",
      ct: occupancies[2],
    },
    {
      time: "Wed",
      ct: occupancies[3],
    },
    {
      time: "Thu",
      ct: occupancies[4],
    },
    {
      time: "Fri",
      ct: occupancies[5],
    },
    {
      time: "Sat",
      ct: occupancies[6],
    },
  ];

  useEffect(() => {
    handleGetOccupancies();
    handleGetLiveOccupancy();
  }, [occupancies, liveOccupancy]);

  //function I added for getting occupancies from a certain day
  //this function will be called when the refresh button I added
  //obviously in the future we want this request to be submitted automatically every couple minutes or so
  async function handleGetOccupancies() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room: "room " + roomNumber,
      }),
    };
    const response = await fetch(`/records/week`, requestOptions);
    if (response.ok) {
      const res = await response.json();
      const averages = res.occupancies;
      //console.log(averages);
      setOccupancies(averages);
      console.log(occupancies);
    }
  }

  async function handleGetLiveOccupancy() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room: "room " + roomNumber,
      }),
    };
    const response = await fetch(`/process-room`, requestOptions);
    if (response.ok) {
      const res = await response.json();
      const occupancy = res.occupancy;
      //console.log(averages);
      setLiveOccupancy(occupancy);
      console.log(occupancy);
    }
  }

  function logout(res) {
    console.log(res);
  }

  function getRoomName() {
    //return props.location.state.item.time;
    return "Room 1";
  }

  function renderChart() {
    return (
      <div>
        {/* <Header /> */}
        <LineChart
          width={500}
          height={300}
          data={graphData}
          // margin={{
          //   top: 5,
          //   right: 30,
          //   left: 20,
          //   bottom: 5,
          // }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="ct"
            stroke="#8884d8"
            activeDot={{ r: 5 }}
          />
        </LineChart>
        {/* <Button onClick={handleGetOccupancies}>Refresh</Button> */}
      </div>
    );
  }

  //for some reason the chart isn't rendering when i put it in the tab
  return (
    <div className="Roompage">
      <Header />
      <h1>Room {roomNumber}</h1>
      {renderChart()}

      {/* <GoogleLogout
        clientId={cID}
        buttonText="Logout"
        onLogoutSuccess={logout}
      /> */}
    </div>
  );
}

export default Roompage;
