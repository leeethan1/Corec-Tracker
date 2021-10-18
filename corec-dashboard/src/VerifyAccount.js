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

function VerifyAccount() {
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [error, setError] = useState();
  const history = useHistory();

  async function handleVerifySuccess(res) {
    const response = await fetch("/account/verify/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emailCode: emailCode,
        phoneCode: phoneCode,
      }),
    });

    if (response.status == 200) {
      history.push("/");
    } else {
      setError(true);
      const res = await response.json();
      setErrMessage(res.message);
    }
  }

  return (
    <div className="VerifyAccount">
      <h1>Verify Account</h1>
      <h2>
        Enter the two verification codes sent to your email and phone number
      </h2>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group size="lg" controlId="email code">
          <Form.Label>Email Verification Code</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={emailCode}
            onChange={(e) => setEmailCode(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="phone code">
          <Form.Label>Phone Verification Code</Form.Label>
          <Form.Control
            type="text"
            value={phoneCode}
            onChange={(e) => setPhoneCode(e.target.value)}
          />
        </Form.Group>
        <Button block size="lg" type="submit" onClick={handleVerifySuccess}>
          Verify
        </Button>
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
      </Form>
    </div>
  );
}

export default VerifyAccount;
