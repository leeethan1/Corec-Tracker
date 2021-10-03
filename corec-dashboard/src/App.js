import {React, useCallback, useState} from "react";
import {BrowserRouter as Router, Switch,Route,Link} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  const [log, setLog] = useState(false);
  const logIn = useCallback(
    () => {
      console.log("logged in!");
      setLog(true);
    }
  );
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" render={props => <Login setLogIn={logIn}/>}/>
          <PrivateRoute isLoggedIn={log} path="/dashboard" component={Dashboard} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

