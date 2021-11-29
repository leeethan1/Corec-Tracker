import { React, useCallback, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "./Login";
import Roompage from "./Roompage";
import Dashboard from "./Dashboard";
import Signup from "./Signup";
import VerifyEmail from "./VerifyEmail";
import VerifyPhone from "./VerifyPhone";
import ForgotPassword from "./ForgotPassword";
import PasswordResetEmailSent from "./PasswordResetEmailSent";
import ResetPassword from "./ResetPassword";
import Settings from "./Settings";
import Favorites from "./Favorites";
import Profile from "./Profile";
import Chat from "./Chat";
import AdminLogin from "./AdminLogin";
import BugReport from "./BugReport";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
//import 'font-awesome/css/font-awesome.min.css';
function App() {
  const [log, setLog] = useState(false);
  const logIn = useCallback(() => {
    console.log("logged in!");
    setLog(true);
  });
  return (
    <Router>
      <div className="margin">
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => <Login setLogIn={logIn} />}
          />
          <Route
            path="/signup"
            render={(props) => <Signup setLogIn={logIn} />}
          />
          <Route exact path="/admin/login" component={AdminLogin} />
          <Route exact path="/email/verify">
            <VerifyEmail />
          </Route>
          <Route exact path="/phone/verify">
            <VerifyPhone />
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
          {/* <Route exact path="/settings">
            <Settings />
          </Route> */}
          <PrivateRoute component={Settings} path="/settings" />
          {/* <PrivateRoute isLoggedIn={log} path="/dashboard" component={Dashboard} /> */}
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/room/:roomName" component={Roompage} />
          <PrivateRoute path="/favorites" component={Favorites} />
          <Route exact path="/chat" component={Chat} />
          <Route exact path="/report" component={BugReport} />
          <PrivateRoute path="/profile" component={Profile} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;