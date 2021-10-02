import React from "react";
import {BrowserRouter as Router, Switch,Route,Link} from "react-router-dom";
import Login from "./Login"
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </Router>
  );
}

// You can think of these components as "pages"
// in your app.

export default App;

