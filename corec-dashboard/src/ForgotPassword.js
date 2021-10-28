import { React, useState } from "react";
import {
  useHistory,
} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Spinner } from "react-bootstrap";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  async function handleForgotPassword(res) {
    setIsLoading(true);
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
      setIsLoading(false);
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
      return <b style={{ color: "red" }}>{errMessage}</b>;
    }
  }

  function loading() {
    if (isLoading) {
      return <Spinner animation="border"/>;
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
      {loading()}
    </div>
  );
}

export default ForgotPassword;
