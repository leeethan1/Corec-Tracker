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

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const history = useHistory();

  async function handleForgotPassword(res) {
    const response = await fetch("/forgot-password/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    const r = await response.json();
    console.log(r);
    if (response.ok) {
      redirectToEmailSent();
    } else {
      setError(true);
      setErrMessage(r.message);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  function redirectToLogin() {
    history.push("/");
  }

  function redirectToEmailSent() {
    history.push("/email-sent");
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
    <div className="ForgotPassword">
      <h1>Forgot Password</h1>
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
        <Button block size="lg" type="submit" onClick={handleForgotPassword}>
          Send Email
        </Button> 
      </Form>
    </div>
  );
}

export default ForgotPassword;
