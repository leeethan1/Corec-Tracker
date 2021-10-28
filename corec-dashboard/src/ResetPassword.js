import { React, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory,
  useParams,
} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Overlay from "react-bootstrap/Overlay"

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const history = useHistory();
  const { token } = useParams();

  async function handleResetPassword(res) {
    //const queryParams = new URLSearchParams(window.location.search);
    //const token = queryParams.get('token');
    console.log(token);
    // if (password.length() == 0 && password !== passwordConfirm) {
    //   setError(true);
    //   setErrMessage("Passwords don't match");
    // } else {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: password,
        passwordConfirm: passwordConfirm,
      }),
    };
    const encodedValue = encodeURIComponent(token);
    const response = await fetch(
      "/password/reset/submit?token=" + encodedValue,
      requestOptions
    );

    if (response.ok) {
      history.push("/");
    } else {
      const x = await response.json();
      console.log(x);
      setError(true);
      setErrMessage(x.message);
    }
    //}
  }

  function isValid() {
    return password.length > 0 && passwordConfirm.length > 0;
  }

  function displayError() {
    if (error) {
      return (
        <div>
          <b style={{"color": 'red'}}>{errMessage}</b>
        </div>
      );
    }
  }

  return (
    <div className="ResetPassword" style={{ margin: 10 }}>
      <h1>Reset Password</h1>
      <Form onSubmit={(e) => e.preventDefault()}>
        <Form.Group size="lg" controlId="password">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            autoFocus
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            autoFocus
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </Form.Group>
        <Button block size="lg" type="submit" onClick={handleResetPassword} disabled={!isValid()}>
          Reset Password
        </Button>
      </Form>
      {displayError()}
    </div>
  );
}

export default ResetPassword;
