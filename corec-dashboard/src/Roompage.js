import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import {
  Col,
  Row,
  Spinner,
  Accordion,
  Dropdown,
  DropdownButton,
  Container,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

const cID =
  "608867787381-cvgulq19nomsanr5b3ho6i2kr1ikocbs.apps.googleusercontent.com";

function Roompage() {
  const [occupancies, setOccupancies] = useState(
    [...new Array(19)].map(() => [0, 0, 0, 0, 0, 0, 0])
  );

  const [weeklyOccupancies, setWeeklyOccupancies] = useState([
    0, 0, 0, 0, 0, 0, 0,
  ]);
  const [maxOccupancies, setMaxOccupancies] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [minOccupancies, setMinOccupancies] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [averages, setAverages] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [forecastDay, setForecastDay] = useState(0);
  const [forecastTime, setForecastTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const [weekBoundaries, setWeekBoundaries] = useState([0, 6]);
  const updateInterval = 10;
  const [weekIndex, setWeekIndex] = useState(0);
  const [graphsLoading, setGraphsLoading] = useState(true);

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

  const [liveOccupancy, setLiveOccupancy] = useState(0);

  //we probably need to have separate graphs for each room
  const [graphs, setGraphs] = useState([]);

  const { roomName } = useParams();

  function convertTo12HourTime(hour) {
    let time = "";
    if (hour < 12) {
      return `${hour} AM`;
    } else {
      return `${hour % 12} PM`;
    }
  }

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

  function createWeeklyData(index) {
    return {
      day: days[index],
      occupancy: weeklyOccupancies[index],
    };
  }

  const times = [
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
  ];

  const graphData = times.map((element, index) => createData(element, index));

  const weeklyGraphData = weeklyOccupancies.map((element, index) =>
    createWeeklyData(index)
  );

  useEffect(() => {
    let interval = null;
    //console.log(tick);
    interval = setInterval(() => {
      setTick((tick) => tick + 1);
    }, updateInterval * 1000);

    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    updateOccupancies();
    handleGetLiveOccupancy();
  }, [tick, roomName]);

  useEffect(() => {
    updateWeeklyOccupancies();
  }, [weekIndex, weekBoundaries, roomName]);

  // async function getAdvancedStatistics() {
  //   //console.log("fetching advanced stats...");
  //   //await sleep(10000);
  //   const requestOptions = {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       room: roomName,
  //     }),
  //   };
  //   const response = await fetch(`/records/advanced`, requestOptions);
  //   if (response.ok) {
  //     const res = await response.json();
  //     setMaxOccupancies(res.maximums);
  //     setMinOccupancies(res.minimums);
  //     setAverages(res.averages);
  //   }
  // }

  async function updateOccupancies() {
    //console.log("fetching graph data...");
    //await sleep(10000);
    setLoading(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room: roomName,
      }),
    };
    const response = await fetch(`/records/get`, requestOptions);
    if (response.ok) {
      const res = await response.json();
      const o = res.occupancies;
      setOccupancies(o);
      getAdvancedStatistics(occupancies);
      //console.log(o);
    }
    setLoading(false);
    setGraphsLoading(false);
  }

  function getAdvancedStatistics(occupancies) {
    let o = occupancies[0].map((_, colIndex) =>
      occupancies.map((row) => row[colIndex])
    );
    setAverages(
      o.map((day, index) =>
        (day.reduce((a, b) => a + b, 0) / day.length).toFixed(2)
      )
    );
    setMinOccupancies(o.map((day, index) => Math.min(...day)));
    //console.log(minOccupancies);
    setMaxOccupancies(o.map((day, index) => Math.max(...day)));
  }

  async function updateWeeklyOccupancies() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room: roomName,
        week: weekIndex,
      }),
    };
    const response = await fetch("/records/week", requestOptions);
    if (response.ok) {
      const res = await response.json();
      const averages = res.occupancies;
      //console.log(averages);
      setWeeklyOccupancies(averages);
    }
  }

  async function handleGetLiveOccupancy() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room: roomName,
      }),
    };
    const response = await fetch(`/process-room`, requestOptions);
    if (response.ok) {
      const res = await response.json();
      const occupancy = res.occupancy;
      //console.log(averages);
      setLiveOccupancy(occupancy);
      //console.log(occupancy);
    }
  }

  function getSunday(index) {
    var curr = new Date(); // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    // first.setDate(first. - 7 * index);
    var firstday = new Date(curr.setDate(first - 7 * index));

    return `${firstday.getMonth() + 1}/${firstday.getDate().toString()}`;
  }

  function renderLoading() {
    if (loading) {
      return <Spinner animation="border" size="sm" />;
    }
  }

  function renderGraphsLoading() {
    if (loading) {
      return (
        <Container>
          <Row>
            <h3>
              <i>Loading Graphs...</i>
            </h3>
          </Row>
          <Row>
            <div className="center">
              <Spinner animation="border" size="lg" />
            </div>
          </Row>
        </Container>
      );
    }
  }

  function updateBoundaries(index, value) {
    let newBoundaries = [...weekBoundaries];
    newBoundaries[index] = value;
    setWeekBoundaries(newBoundaries);
  }

  function renderFilterOption() {
    return (
      <div>
        <select
          defaultValue={0}
          class="form-select"
          aria-label="Default select example"
          onChange={(e) => {
            e.preventDefault();
            updateBoundaries(0, parseInt(e.target.value));
            console.log(e.target.value, weekBoundaries);
          }}
        >
          {days.map((day, index) => {
            return (
              <option value={index} disabled={index >= weekBoundaries[1]}>
                {day}
              </option>
            );
          })}
        </select>
        <select
          defaultValue={6}
          class="form-select"
          aria-label="Default select example"
          onChange={(e) => {
            e.preventDefault();
            updateBoundaries(1, parseInt(e.target.value));
            console.log(e.target.value, weekBoundaries);
          }}
        >
          {days.map((day, index) => {
            return (
              <option value={index} disabled={index <= weekBoundaries[0]}>
                {day}
              </option>
            );
          })}
        </select>
        <select onChange={(e) => setWeekIndex(parseInt(e.target.value))}>
          {[0, 1, 2].map((week, index) => {
            return <option value={index}>Week of {getSunday(index)}</option>;
          })}
        </select>
      </div>
    );
  }

  function renderChart(chart) {
    if (graphsLoading) {
      return renderGraphsLoading();
    }
    switch (chart) {
      case "Line Graph":
        return (
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>View by time</Accordion.Header>
              <Accordion.Body>
                <LineChart
                  width={1200}
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
                  <Legend height={36} />
                  {days.map((day, index) => (
                    <Line
                      type="monotoneX"
                      dataKey={day}
                      stroke="#8884d8"
                      activeDot={{ r: 5 }}
                      stroke={chartColors[index]}
                    />
                  ))}
                </LineChart>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>View by day</Accordion.Header>
              <Accordion.Body>
                {renderFilterOption()}
                <LineChart
                  width={1200}
                  height={300}
                  data={weeklyGraphData.slice(
                    weekBoundaries[0],
                    weekBoundaries[1] + 1
                  )}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend height={36} />
                  <Line dataKey="occupancy" type="monotoneX" />
                </LineChart>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        );
        break;
      case "Bar Chart":
        return (
          <BarChart
            width={1000}
            height={300}
            data={graphData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend height={36} />
            {days.map((day, index) => (
              <Bar dataKey={day} fill={chartColors[index]}></Bar>
            ))}
          </BarChart>
        );
      default:
        return <h1>NA</h1>;
    }
  }

  function indexOfSmallest(a) {
    var lowest = 0;
    for (var i = 1; i < a.length; i++) {
      if (a[i] < a[lowest]) lowest = i;
    }
    return lowest;
  }

  function indexOfLargest(a) {
    var highest = 0;
    for (var i = 1; i < a.length; i++) {
      if (a[i] > a[highest]) highest = i;
    }
    return highest;
  }

  function displayAdvancedStats() {
    return (
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>View Advanced Stats</Accordion.Header>
          <Accordion.Body>
            {days.map((day, index) => (
              <p>
                The average occupancy on <b>{day}</b> is around{" "}
                <b>{averages[index]}</b> people with a max occupancy of{" "}
                <b>{maxOccupancies[index]}</b> people and a minimum of{" "}
                <b>{minOccupancies[index]}</b> people
              </p>
            ))}
            <p>
              It seems like <b>{days[indexOfLargest(averages)]}</b> is the
              busiest day while <b>{days[indexOfSmallest(averages)]}</b> is the
              least busiest day
            </p>
            <div className="horizontal">
              The predicted occupancy for{" "}
              <DropdownButton
                title={days[forecastDay]}
                size="sm"
                variant="secondary"
              >
                {days.map((day, index) => (
                  <Dropdown.Item onClick={() => setForecastDay(index)}>
                    {day}
                  </Dropdown.Item>
                ))}
              </DropdownButton>{" "}
              at{" "}
              <DropdownButton
                title={times[forecastTime]}
                size="sm"
                variant="secondary"
              >
                {times.map((time, index) => (
                  <Dropdown.Item onClick={() => setForecastTime(index)}>
                    {time}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
              is
              <b> {occupancies[forecastTime][forecastDay]} </b>
              people
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  }

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
            {["Line Graph", "Bar Chart"].map((element, index) => (
              <Tab eventKey={element} title={element}>
                {renderChart(element)}
                {/* <h1>{element}</h1> */}
              </Tab>
            ))}
          </Tabs>
        </span>

        {/* {renderChart(0)}
        {renderChart(1)} */}
      </span>
      {displayAdvancedStats()}
      {/* <GoogleLogout
        clientId={cID}
        buttonText="Logout"
        onLogoutSuccess={logout}
      /> */}
      <p className="center">
        <i>Occupancy statistics are updated every {updateInterval} seconds</i>
        <span>{renderLoading()}</span>
      </p>
    </div>
  );
}

export default Roompage;
