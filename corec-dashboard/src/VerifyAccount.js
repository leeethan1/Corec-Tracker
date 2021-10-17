import {React, useState} from "react";
import {BrowserRouter as Router, Switch, Route, Link, useHistory} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function VerifyAccount() {

    const [emailCode, setEmailCode] = useState("");
    const [phoneCode, setPhoneCode] = useState("");
    const history = useHistory();

    function handleVerifySuccess(res, data = {
      emailCode: emailCode,
      phoneCode: phoneCode
    }) {
        fetch("/account/verify/submit", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(res => res.json())
          .then((response) => {
            console.log(response)
          });
          history.push('/dashboard');
    }

    return (
        <div className="VerifyAccount">
          <h1>
            Verify Account
          </h1>
          <h2>Enter the two verification codes sent to your email and phone number</h2>
          <Form>
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
          </Form>
        </div>
      );
}

export default VerifyAccount