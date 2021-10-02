import {React, useState} from "react";
import {BrowserRouter as Router, Switch, Route, Link, useHistory} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import GoogleLogin from "react-google-login";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const cID = "608867787381-cvgulq19nomsanr5b3ho6i2kr1ikocbs.apps.googleusercontent.com"

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  function redirectToDashBoard() {
    history.push('/dashboard')
  }

  function handleFailure(res) {
    console.log(res);
  }
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
        <Button block size="lg" type="submit" onClick={redirectToDashBoard} disabled={!validateForm()}>
          Login
        </Button>
        <GoogleLogin
            clientId={cID}
            buttonText="Log in with Google"
            onSuccess={redirectToDashBoard}
            onFailure={handleFailure}
            cookiePolicy={'single_host_origin'}
        />
      </Form>
    </div>
  );
}

export default Login;

