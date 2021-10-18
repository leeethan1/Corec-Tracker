import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { GoogleLogout } from "react-google-login";
import Header from "./Header";
import { Tabs, Tab } from "react-bootstrap";
import { Button } from "react-bootstrap";

const cID =
  "608867787381-cvgulq19nomsanr5b3ho6i2kr1ikocbs.apps.googleusercontent.com";

function Roompage(props) {
  const [occupancies, setOccupancies] = useState([0, 0, 0, 0, 0, 0, 0]);

  //we probably need to have separate graphs for each room
  const [graphs, setGraphs] = useState([]);

  //for now we'll separate by time
  //but in the future we'll have to separate by time
  //and have different graphs for each day of the week
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

  //function I added for getting occupancies from a certain day
  //this function will be called when the refresh button I added
  //obviously in the future we want this request to be submitted automatically every couple minutes or so
  async function handleGetOccupancies(day) {
    const response = await fetch("/records/" + day);
    if (response.ok) {
      const res = await response.json();
      const averages = res.occupancies;
      console.log(averages);
      setOccupancies(averages);
    }
  }

  function logout(res) {
    console.log(res);
  }

  function getRoomName() {
    //return props.location.state.item.time;
    return "Room 1";
  }

  function renderChart(day) {
    return (
      <div>
        <Header />
        <LineChart
          width={500}
          height={300}
          data={graphData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
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
        <Button onClick={handleGetOccupancies(day)}>Refresh</Button>
      </div>
    );
  }

  //for some reason the chart isn't rendering when i put it in the tab
  return (
    <div>
      <Tabs className="mb-3">
        <Tab title="Room 1"></Tab>
        <Tab title="Room 2"></Tab>
        <Tab title="Room 3"></Tab>
        <Tab title="Room 4"></Tab>
      </Tabs>
      {renderChart(4)}

      {/* <GoogleLogout
        clientId={cID}
        buttonText="Logout"
        onLogoutSuccess={logout}
      /> */}
    </div>
  );
}

export default Roompage;
