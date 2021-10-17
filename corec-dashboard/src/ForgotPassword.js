import {React, useState} from "react";
import {BrowserRouter as Router, Switch, Route, Link, useHistory} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const history = useHistory();

    function handleForgotPassword(res, data = {
      email: email
    }) {
        fetch("/forgot-password/submit", {
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
          history.push('/email-sent');
    }

    return (
        <div className="ForogtPassword">
          <h1>
            Forgot Password
          </h1>
          <Form>
            <Form.Group size="lg" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                autoFocus
                type="text"
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

export default ForgotPassword