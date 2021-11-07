import { React, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Form, FormCheck } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import GoogleLogin from "react-google-login";

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

  function handleSubmit(event) {
    event.preventDefault();
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

  async function handleLogin() {
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

      history.push("/dashboard", { user: "test" });
    } else {
      setLoginFail(true);
      const res = await response.json();
      console.log(res);
    }
  }

  function formFailure() {
    if (loginFail) {
      return (
        <div>
          <b style={{ color: "red" }}>Email or password is incorrect</b>
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
    if (response.ok) {
      setLogIn();
      const tokens = await response.json();
      if (remember) {
        localStorage.setItem("access", tokens.access_token);
        localStorage.setItem("refresh", tokens.refresh_token);
      }
      sessionStorage.setItem("access", tokens.access_token);
      sessionStorage.setItem("refresh", tokens.refresh_token);
      history.push("/dashboard", { user: res.profileObj.name });
    }
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

  return (
    <div className="Login">
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
        <FormCheck
          label={<p>Remember Me</p>}
          onChange={() => setRemember(!remember)}
          checked={remember}
        />
        <Button
          block
          size="lg"
          type="submit"
          onClick={handleLogin}
          disabled={!validateForm()}
        >
          Login
        </Button>
        <Button
          block
          size="lg"
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
        <Button
          block
          size="lg"
          type="submit"
          variant="secondary"
          onClick={redirectToSignup}
        >
          Create Account
        </Button>
        <Button
          block
          size="lg"
          type="submit"
          variant="secondary"
          onClick={redirectForgotPassword}
        >
          Forgot Password
        </Button>
        <GoogleLogin
          clientId={cID}
          buttonText="Log in with Google"
          onSuccess={handleGoogleSuccess}
          onFailure={handleFailure}
          disabled={false}
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
