import { React, useState } from "react";
import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

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

    if (response.ok) {
      const tokens = await response.json();
      localStorage.setItem("access", tokens.access_token);
      localStorage.setItem("refresh", tokens.refresh_token);
      history.push("/dashboard");
    } else {
      setError(true);
      const res = await response.json();
      setErrMessage(res.message);
    }
  }

  function displayError() {
    if (error) {
      return <b style={{ color: "red" }}>{errMessage}</b>;
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
        <Button block size="lg" type="submit" onClick={handleVerifySuccess} disabled={phoneCode.length == 0 || emailCode.length == 0}>
          Verify
        </Button>
        <Button variant="secondary" onClick={() => history.push("/signup")}>
          Back
        </Button>
        {displayError()}
      </Form>
    </div>
  );
}

export default VerifyAccount;
