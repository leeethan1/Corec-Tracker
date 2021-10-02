import React from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import {LineChart, XAxis, YAxis, Line, Tooltip, CartesianGrid} from "recharts"

function Dashboard() {
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
  return (
    <div>
      <h1>Dashboard</h1>
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
    </div>
  );
}

// You can think of these components as "pages"
// in your app.

export default Dashboard;

