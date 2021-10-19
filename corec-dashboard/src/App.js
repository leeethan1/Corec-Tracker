import {React, useCallback, useState} from "react";
import {BrowserRouter as Router, Switch,Route,Link} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "./Login";
import Roompage from "./Roompage";
import Dashboard from "./Dashboard"
import Signup from "./Signup";
import VerifyAccount from "./VerifyAccount";
import ForgotPassword from "./ForgotPassword";
import PasswordResetEmailSent from "./PasswordResetEmailSent";
import ResetPassword from "./ResetPassword";
import Settings from "./Settings";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

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
          <Route exact path="/account/verify">
            <VerifyAccount />
          </Route>
          <Route exact path="/email-sent">
            <PasswordResetEmailSent />
          </Route>
          <Route exact path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Route exact path="/password/reset/:token">
            <ResetPassword />
          </Route>
          <Route exact path="/settings">
            <Settings />
          </Route>
          <PrivateRoute isLoggedIn={log} path="/dashboard" component={Dashboard} />
          <Route exact path="/room/:roomNumber" component={Roompage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

