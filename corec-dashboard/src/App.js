import {React, useCallback, useState} from "react";
import {BrowserRouter as Router, Switch,Route,Link} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "./Login";
import Roompage from "./Roompage";
import Dashboard from "./Dashboard"
import Signup from "./Signup";
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
          <Route path="/signup" render={props => <Signup setLogIn={logIn}/>}/>
          <PrivateRoute isLoggedIn={log} path="/dashboard" component={Dashboard} />
          <PrivateRoute isLoggedIn={log} path="/roompage" component={Roompage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

