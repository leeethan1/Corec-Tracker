import {React, useState} from "react";
import {BrowserRouter as Router, Switch, Route, Link, useHistory, useParams} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function ResetPassword() {

    const [password, setPassword] = useState("");
    const history = useHistory();
    const {token} = useParams();

    function handleResetPassword(res, data = {
      password: password
    }) {
        //const queryParams = new URLSearchParams(window.location.search);
        //const token = queryParams.get('token');
        const encodedValue = encodeURIComponent(token);
        fetch(`/password/reset/submit?token=${encodedValue}`, {
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
        <div className="ResetPassword">
          <h1>
            Forgot Password
          </h1>
          <Form>
            <Form.Group size="lg" controlId="password">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                autoFocus
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button block size="lg" type="submit" onClick={handleResetPassword}>
              Reset Password
            </Button>
          </Form>
        </div>
      );
}

export default ResetPassword