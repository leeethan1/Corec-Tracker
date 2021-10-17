import {React, useState} from "react";
import {BrowserRouter as Router, Switch, Route, Link, useHistory} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Overlay from "react-overlays/esm/Overlay";

function VerifyAccount() {

    const [emailCode, setEmailCode] = useState("");
    const [phoneCode, setPhoneCode] = useState("");
    const [error, setError] = useState({
      value: false
    })
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
          .then((response) => {
            console.log(response)
            if (response.status == 200) {
              history.push('/dashboard');
            } else {
              setError(true);
            }
          });
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
            <Overlay show={!error} placement="right">
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          <div
            {...props}
            style={{
              backgroundColor: 'rgba(255, 100, 100, 0.85)',
              padding: '2px 10px',
              color: 'white',
              borderRadius: 3,
              ...props.style,
            }}
          >
            Could not verify account
          </div>
        )}
        </Overlay>
          </Form>
        </div>
      );
}

export default VerifyAccount