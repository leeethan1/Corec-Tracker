import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import {
  LineChart,
  BarChart,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Bar,
} from "recharts";
import { GoogleLogout } from "react-google-login";
import Header from "./Header";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

const cID =
  "608867787381-cvgulq19nomsanr5b3ho6i2kr1ikocbs.apps.googleusercontent.com";

function Roompage() {
  const [occupancies, setOccupancies] = useState([]);
  const [chartType, setChartType] = useState(0);

  //we probably need to have separate graphs for each room
  const [graphs, setGraphs] = useState([]);

  const { roomNumber } = useParams();

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
  }, [occupancies]);

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
      //console.log(occupancies);
    }
  }

  function logout(res) {
    console.log(res);
  }

  function getRoomName() {
    //return props.location.state.item.time;
    return "Room 1";
  }

  function renderChart(chart) {
    switch (chart) {
      case 0:
        return (
          <LineChart
            width={1000}
            height={400}
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
        );
        break;
      case 1:
        return (
          <BarChart width={1000} height={400} data={graphData}>
            <XAxis dataKey="time" fill="#000000" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ct"></Bar>
          </BarChart>
        );
      default:
        return <h1>NA</h1>;
    }
  }

  //for some reason the chart isn't rendering when i put it in the tab
  return (
    <div className="vertical">
      <Header />
      <h1 className="center">Room {roomNumber}</h1>
      <h2 className="center">
        <Col>
          Live Occupancy: <b>56</b>{" "}
          <Spinner variant="danger" animation="grow" size="sm" />
        </Col>
      </h2>
      <span className="center">
        <span className="vertical">
          <Tabs
            id="chart tabs"
            activeKey={0}
            onSelect={(k) => setChartType(k)}
          >
            {[0,1].map((element, index) => (
              <Tab eventKey={element} title={index}>
                {renderChart(chartType)}
                {/* <h1>{element}</h1> */}
              </Tab>
            ))}
          </Tabs>
        </span>
        {/* {renderChart(0)}
        {renderChart(1)} */}
      </span>

      {/* <GoogleLogout
        clientId={cID}
        buttonText="Logout"
        onLogoutSuccess={logout}
      /> */}
    </div>
  );
}

export default Roompage;
