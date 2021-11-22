import { React, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, FormCheck, InputGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import GoogleLogin from "react-google-login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/fontawesome-free-solid";
import axios from "axios";

const cID =
  "608867787381-cvgulq19nomsanr5b3ho6i2kr1ikocbs.apps.googleusercontent.com";
const facebookID = "294054042557801";

var rememberUser = false;
export { rememberUser };

function Login({ setLogIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("test");
  const [googleData, setGoogleData] = useState([]);
  const [loginFail, setLoginFail] = useState(false);
  const [remember, setRemember] = useState(false);
  const history = useHistory();

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleChatLogin(e, secret) {
    e.preventDefault();
    const authHeader = {
      "Private-Key": "b35df4a0-b81b-45d0-b331-0b077b14d0bc",
    };
    const authObject = {
      "Project-ID": "9e45fcff-6309-40db-b521-4ef91549ccd2",
      "User-Name": email,
      "User-Secret": password,
    };
    try {
      await axios.put(
        "https://api.chatengine.io/users",
        {
          username: email,
          secret: secret,
        },
        {
          headers: authHeader,
        }
      );
      sessionStorage.setItem("username", email);
      //sessionStorage.setItem("password", secret);
      if (remember) {
        localStorage.setItem("username", email);
        //localStorage.setItem("password", secret);
      }
    } catch (error) {
      console.log(error);
      //setLoginFail(true);
    }
  }

  async function handleGetLogin() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access: localStorage.getItem("access"),
      },
    };
    const response = await fetch("/login/get", requestOptions);
    if (response.ok) {
      //const res = await response.json();
      history.push("/dashboard");
      //setEmail(res.email);
      //setPassword(res.password);
    } else {
      const res = await response.json();
      console.log(res);
    }
  }

  useEffect(() => {
    handleGetLogin();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
        remember: remember,
      }),
    };
    const response = await fetch("/login/submit", requestOptions);
    if (response.ok) {
      setLogIn();
      rememberUser = remember;
      console.log(rememberUser);
      const tokens = await response.json();
      sessionStorage.setItem("access", tokens.access_token);
      sessionStorage.setItem("refresh", tokens.refresh_token);
      if (remember) {
        localStorage.setItem("access", tokens.access_token);
        localStorage.setItem("refresh", tokens.refresh_token);
        localStorage.setItem("remember", true);
        //sessionStorage.setItem("access", localStorage.getItem("access"));
        //sessionStorage.setItem("refresh", localStorage.getItem("refresh"));
      }
      handleChatLogin(e, tokens.access_token);
      history.push("/dashboard", { user: "test" });
    } else {
      setLoginFail(true);
      const res = await response.json();
      console.log(res);
    }
  }

  function formFailure() {
    if (loginFail) {
      return <div style={{ color: "red" }}>Email or password is incorrect</div>;
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
    if (response.ok) {
      setLogIn();
      const tokens = await response.json();
      if (remember) {
        localStorage.setItem("access", tokens.access_token);
        localStorage.setItem("refresh", tokens.refresh_token);
        localStorage.setItem("remember", true);
      }
      localStorage.setItem("access", tokens.access_token);
      localStorage.setItem("refresh", tokens.refresh_token);
      sessionStorage.setItem("access", tokens.access_token);
      sessionStorage.setItem("refresh", tokens.refresh_token);
      history.push("/dashboard", { user: res.profileObj.name });
    }
  }

  // function redirectToSignup(res) {
  //   history.push("/signup");
  // }

  // function redirectForgotPassword(res) {
  //   history.push("/forgot-password");
  // }

  function handleGoogleFailure(res) {
    console.log(res);
  }

  return (
    <div>
      <div id="Login-Panel">
        <h1>Login</h1>
        <Form onSubmit={handleLogin}>
          <Form.Group size="lg" controlId="email" className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon="envelope" />
              </InputGroup.Text>
              <Form.Control
                autoFocus
                placeholder="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group size="lg" controlId="password" className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <FontAwesomeIcon icon="key" />
              </InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {formFailure()}
            </InputGroup>
          </Form.Group>
          <div id="Remember-Forgot">
            <FormCheck
              label={<p>Remember Me</p>}
              onChange={() => setRemember(!remember)}
              checked={remember}
            />
            <a id="Forgot" href="/forgot-password">
              Forgot Password
            </a>
          </div>
          <div id="Login-Aree">
            <Button
              id="Login-Button"
              block
              size="lg"
              type="submit"
              onClick={handleLogin}
              disabled={!validateForm()}
            >
              Log In
            </Button>
          </div>
          <a href="/signup" id="Signup-Link">
            Don't have an account? Sign up
          </a>
          <div id="Other-Options">
            <Button
              block
              size="md"
              type="submit"
              variant="secondary"
              onClick={(e) => {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                sessionStorage.removeItem("access");
                sessionStorage.removeItem("refresh");
                history.push("/dashboard");
              }}
            >
              Continue as Guest
            </Button>
            <GoogleLogin
              // render={(renderProps) => {
              //   return (
              //   <Button onClick={renderProps.onClick} disabled={renderProps.disabled}>
              //     <FontAwesomeIcon icon="google" />
              //   </Button>)
              // }}
              theme="dark"
              clientId={cID}
              buttonText="Log in with Google"
              onSuccess={handleGoogleSuccess}
              onFailure={handleGoogleFailure}
              cookiePolicy={"single_host_origin"}
            />
          </div>
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
    </div>
  );
}

export default Login;