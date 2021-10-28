import React, { useState, useEffect } from "react";
import {
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
  Bar,
  Legend,
} from "recharts";
import Header from "./Header";
import { Col, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

const cID =
  "608867787381-cvgulq19nomsanr5b3ho6i2kr1ikocbs.apps.googleusercontent.com";

function Roompage() {
  const [occupancies, setOccupancies] = useState(
    [...new Array(19)].map(() => [0, 0, 0, 0, 0, 0, 0])
  );

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const chartColors = [
    "#F00000",
    "#ff7605",
    "#ffcf24",
    "#00e016",
    "#005de0",
    "#7800e0",
    "#e00056",
  ];

  const [liveOccupancy, setLiveOccupancy] = useState(0)

  //we probably need to have separate graphs for each room
  const [graphs, setGraphs] = useState([]);

  const { roomName } = useParams();

  function createData(t, index) {
    return {
      time: t,
      [days[0]]: occupancies[index][0],
      [days[1]]: occupancies[index][1],
      [days[2]]: occupancies[index][2],
      [days[3]]: occupancies[index][3],
      [days[4]]: occupancies[index][4],
      [days[5]]: occupancies[index][5],
      [days[6]]: occupancies[index][6],
    };
  }

  const graphData = [
    "5 am",
    "6 am",
    "7 am",
    "8 am",
    "9 am",
    "10 am",
    "11 am",
    "12 pm",
    "1 pm",
    "2 pm",
    "3 pm",
    "4 pm",
    "5 pm",
    "6 pm",
    "7 pm",
    "8 pm",
    "9 pm",
    "10 pm",
    "11 pm",
  ].map((element, index) => createData(element, index));



  useEffect(() => {
    updateOccupancies();
    handleGetLiveOccupancy();
  }, []);


  async function updateOccupancies() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room: roomName.toLowerCase(),
      }),
    };
    const response = await fetch(`/records/get`, requestOptions);
    if (response.ok) {
      const res = await response.json();
      const o = res.occupancies;
      //console.log(averages);
      setOccupancies(o);
      //console.log(occupancies);
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

  function renderChart(chart) {
    switch (chart) {
      case "Line Graph":
        return (
          <LineChart
            width={1200}
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
            <Legend />
            {days.map((day, index) => (
              <Line
                type="monotone"
                dataKey={day}
                stroke="#8884d8"
                activeDot={{ r: 5 }}
                stroke={chartColors[index]}
              />
            ))}
          </LineChart>
        );
        break;
      case "Bar Chart":
        return (
          <BarChart width={1000} height={300} data={graphData}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            {days.map((day, index) => (
              <Bar dataKey={day} fill={chartColors[index]}></Bar>
            ))}
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
      <h1 className="center">{roomName}</h1>
      <h2 className="center">
        <Col>
          Live Occupancy: <b>{liveOccupancy}</b>{" "}
          <Spinner variant="danger" animation="grow" size="sm" />
        </Col>
      </h2>
      <span className="center">
        <span className="vertical">
          <Tabs
            id="chart tabs"
            defaultActiveKey="Line Graph"
            // onSelect={(k) => {
            //   setChartType(k);
            //   console.log(chartType);
            // }}
          >
            {["Line Graph", "Bar Chart"].map(
              (element, index) => (
                <Tab eventKey={element} title={element}>
                  {renderChart(element)}
                  {/* <h1>{element}</h1> */}
                </Tab>
              )
            )}
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
