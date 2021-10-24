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

  // const graphData = [
  //   {
  //     time: "5 am",
  //     0: occupancies[0][0],
  //     2: occupancies[0][1],
  //     3: occupancies[0][2],
  //     4: occupancies[0][3],
  //     5: occupancies[0][4],
  //     6: occupancies[0][5],
  //     7: occupancies[0][6],
  //   },
  //   {
  //     time: "6 am",
  //     5: occupancies[1][0],
  //     6: occupancies[1][1],
  //     7: occupancies[1][2],
  //     8: occupancies[1][3],
  //   },
  //   {
  //     time: "7 am",
  //     5: occupancies[2][0],
  //     6: occupancies[2][1],
  //     7: occupancies[2][2],
  //     8: occupancies[2][3],
  //   },
  //   {
  //     time: "8 am",
  //     5: occupancies[3][0],
  //     6: occupancies[3][1],
  //     7: occupancies[3][2],
  //     8: occupancies[3][3],
  //   },
  //   {
  //     time: "9 am",
  //     5: occupancies[4][0],
  //     6: occupancies[4][1],
  //     7: occupancies[4][2],
  //     8: occupancies[4][3],
  //   },
  //   {
  //     time: "10 am",
  //     5: occupancies[5][0],
  //     6: occupancies[5][1],
  //     7: occupancies[5][2],
  //     8: occupancies[5][3],
  //   },
  //   {
  //     time: "11 am",
  //     5: occupancies[6][0],
  //     6: occupancies[6][1],
  //     7: occupancies[6][2],
  //     8: occupancies[6][3],
  //   },
  // ];

  useEffect(() => {
    updateOccupancies();
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

  async function updateOccupancies() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room: "room " + roomNumber,
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
