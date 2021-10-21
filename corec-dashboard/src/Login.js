import { React, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Overlay from "react-overlays/esm/Overlay";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";

const cID =
  "608867787381-cvgulq19nomsanr5b3ho6i2kr1ikocbs.apps.googleusercontent.com";
const facebookID = "294054042557801";

function Login({ setLogIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("test");
  const [googleData, setGoogleData] = useState([]);
  const [loginFail, setLoginFail] = useState(false);
  const history = useHistory();

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  async function checkLogin(res) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };
    const response = await fetch("/login/submit", requestOptions);

    if (response.ok) {
      setLogIn();
      history.push("/dashboard", { user: "test" });
    } else {
      setLoginFail(true);
    }
  }

  function formFailure() {
    if (loginFail) {
      return (
        <div>
          <Overlay show={loginFail} placement="right">
            {({ placement, arrowProps, show: _show, popper, ...props }) => (
              <div
                {...props}
                style={{
                  backgroundColor: "rgba(255, 100, 100, 0.85)",
                  padding: "2px 10px",
                  color: "white",
                  borderRadius: 3,
                  ...props.style,
                }}
              >
                {"Email or password is incorrect"}
              </div>
            )}
          </Overlay>
        </div>
      );
    }
  }

  async function handleGoogleSuccess(res) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: res.profileObj.email,
        name: res.profileObj.name,
      }),
    };
    const response = await fetch("/googlelogin", requestOptions);
    console.log(response.json());
    history.push("/dashboard", { user: res.profileObj.name });
  }

  function redirectToSignup(res) {
    history.push("/signup");
  }

  function redirectForgotPassword(res) {
    history.push("/forgot-password");
  }

  function handleFailure(res) {
    console.log(res);
  }

  // function responseFacebook(res) {
  //   console.log(res);
  // }

  return (
    <div className="Login" style={{margin:10}}>
      <h1>Login</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {formFailure()}
        </Form.Group>
        <Button
          block
          size="lg"
          type="submit"
          onClick={checkLogin}
          disabled={!validateForm()}
        >
          Login
        </Button>
        <Button block size="lg" type="submit" variant="secondary" onClick={(e)=>history.push('/room/1')}>
          Continue as Guest
        </Button>
        <Button block size="lg" type="submit" variant="secondary" onClick={redirectToSignup}>
          Create Account
        </Button>
        <Button block size="lg" type="submit" variant="secondary" onClick={redirectForgotPassword}>
          Forgot Password
        </Button>
        <GoogleLogin
          clientId={cID}
          buttonText="Log in with Google"
          onSuccess={handleGoogleSuccess}
          onFailure={handleFailure}
          cookiePolicy={"single_host_origin"}
        />
        {/* <FacebookLogin
          appId={facebookID}
          autoLoad={true}
          fields="name,email,picture"
          callback={responseFacebook}
          cssClass="my-facebook-button-class"
          icon="fa-facebook"
        /> */}
      </Form>
    </div>
  );
}

export default Login;
