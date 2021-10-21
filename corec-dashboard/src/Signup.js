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
import PhoneInput from "react-phone-number-input";
import Overlay from "react-overlays/esm/Overlay";
import "react-phone-number-input/style.css";

function Signup({ setLogIn }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  function validateForm() {
    return email.length > 0 && password.length > 0 && name.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  async function handleSignupSuccess(res) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
        phone: phone,
      }),
    };
    const response = await fetch("/signup/submit", requestOptions);
    //console.log(json);
    if (response.status === 200) {
      history.push("/account/verify");
    } else {
      setError(true);
      const x = await response.json();
      console.log(x.message);
      setErrMessage(x.message);
    }
    //setLogIn();
  }

  function displayError() {
    if (error) {
      return (
        <Overlay show={error} placement="right">
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
              {errMessage}
            </div>
          )}
        </Overlay>
      );
    }
  }

  return (
    <div className="Signup">
      <h1>Sign Up</h1>
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
        <Form.Group size="lg" controlId="phone">
          <PhoneInput
            placeholder="Phone Number"
            value={phone}
            onChange={setPhone}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {displayError()}
        </Form.Group>
        <Button
          block
          size="lg"
          type="submit"
          onClick={handleSignupSuccess}
          disabled={!validateForm()}
        >
          Sign Up
        </Button>
      </Form>
    </div>
  );
}

export default Signup;
