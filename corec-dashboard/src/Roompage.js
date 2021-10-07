import React from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {LineChart, XAxis, YAxis, Line, Tooltip, CartesianGrid} from "recharts";
import { GoogleLogout } from 'react-google-login';

const cID = "608867787381-cvgulq19nomsanr5b3ho6i2kr1ikocbs.apps.googleusercontent.com";

function Roompage(props) {

  const data = [
    {
      name: "Mon",
      ct: 15
    },
    {
      name: "Tue",
      ct: 30
    },
    {
      name: "Wed",
      ct: 10
    },
    {
      name: "Thu",
      ct: 3
    },
    {
      name: "Fri",
      ct: 50
    }
  ];
  function logout(res) {
    console.log(res);
  }
  function getRoomName() {
    return props.location.state.item.name;
  }
  return (
    <div>
      <h1>{getRoomName()}</h1>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5}}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="ct"
          stroke="#8884d8"
          activeDot={{ r: 5 }}/>
      </LineChart>
      {/* <GoogleLogout
        clientId={cID}
        buttonText="Logout"
        onLogoutSuccess={logout}
      /> */}
    </div>
  );
}

export default Roompage;

