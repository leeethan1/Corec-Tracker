import {React, useState} from "react";
import {BrowserRouter as Router, Switch, Route, Link, useHistory} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function Signup({setLogIn}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  function validateForm() {
    return email.length > 0 && password.length > 0 && name.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  function handleSignupSuccess(res) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'email': email,
        'password': password,
        'phone': "12312"})
    };
    fetch("/signup", requestOptions)
    .then(res => res.json())
    .then((response) => {
      console.log("hello" + response)
    });
    history.push('/dashboard', {user: name});
    setLogIn();
  }

  return (
    <div className="Signup">
      <h1>
        Sign Up
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
        <Form.Group size="lg" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
        <Button block size="lg" type="submit" onClick={handleSignupSuccess} disabled={!validateForm()}>
          Sign Up
        </Button>
      </Form>
    </div>
  );
}

export default Signup;

