import {React, useState} from "react";
import {BrowserRouter as Router, Switch, Route, Link, useHistory} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login";

const cID = "608867787381-cvgulq19nomsanr5b3ho6i2kr1ikocbs.apps.googleusercontent.com";
const facebookID = "294054042557801";

function Login({setLogIn}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("test");
  const [googleData, setGoogleData] = useState([]);
  const history = useHistory();

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  function checkLogin() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'email': email,
        'password': password})
    };
    fetch("/login", requestOptions)
    .then(res => res.json())
    .then((response) => {
      console.log(response)
    });
    setLogIn();
    history.push('/dashboard', {user: name});
  }

  function handleGoogleSuccess(res) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'email': res.profileObj.email,
        'name': res.profileObj.name})
    };
    fetch("/googlelogin", requestOptions)
    .then(res => res.json())
    .then((response) => {
      console.log(response)
    });
    setGoogleData(res.profileObj);
    setLogIn();
    history.push('/dashboard', {user: res.profileObj.name});
  }

  function redirectToSignup(res) {
    history.push('/signup');
  }

  function handleFailure(res) {
    console.log(res);
  }

  // function responseFacebook(res) {
  //   console.log(res);
  // }

  return (
    <div className="Login">
      <h1>
        Login
      </h1>
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
        </Form.Group>
        <Button block size="lg" type="submit" onClick={checkLogin} disabled={!validateForm()}>
          Login
        </Button>
        <Button block size="lg" type="submit" onClick={redirectToSignup}>
          New User?
        </Button>
        <GoogleLogin
            clientId={cID}
            buttonText="Log in with Google"
            onSuccess={handleGoogleSuccess}
            onFailure={handleFailure}
            cookiePolicy={'single_host_origin'}
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

