import React, { useState, useEffect, Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  useParams,
  useHistory,
} from "react-router-dom";
import { Button, FormCheck, Alert } from "react-bootstrap";
import Slider from "react-rangeslider";
import ReactSwitch from "react-switch";

function Settings() {
  const [emailsOn, setEmailsOn] = useState(true);
  const [smsOn, setSmsOn] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState([
    {
      room: "Room 1",
      on: true,
      threshold: 10,
    },
    {
      room: "Room 2",
      on: true,
      threshold: 10,
    },
    {
      room: "Room 3",
      on: true,
      threshold: 10,
    },
    {
      room: "Room 4",
      on: true,
      threshold: 10,
    },
  ]);
  const history = useHistory();

  function toggleRoom(roomName) {
    const roomNumber = parseInt(roomName.substring(5));
    let newSettings = [...notificationSettings];
    newSettings[roomNumber - 1].on = !newSettings[roomNumber - 1].on;
    setNotificationSettings(newSettings);
    console.log(
      "Toggled " + roomName + " to " + notificationSettings[roomNumber - 1].on
    );
    console.log(notificationSettings);
  }

  function changeThreshold(roomName, threshold) {
    let t = parseInt(threshold);
    const roomNumber = parseInt(roomName.substring(5));
    let newSettings = [...notificationSettings];
    newSettings[roomNumber - 1].threshold = t;
    setNotificationSettings(newSettings);
  }

  let renderNotifications = notificationSettings.map((notification, index) => {
    return (
      <div>
        <label>
          <FormCheck
            type="switch"
            label={notification.room}
            onChange={(e) => {
              toggleRoom(notification.room);
            }}
            checked={notification.on}
          />

          <div className="rowC">
            <label>Threshold</label>
            {/* <Slider
              value={notification.threshold}
              min={1}
              max={100}
              step={1}
              onChange={(value) => {
                changeThreshold(notification.room, value);
              }}
            /> */}
            <div className="my-5">
              <input type="range" min="10" max="100" step="1" />
            </div>
            <p1>{index}</p1>
          </div>
        </label>
      </div>
    );
  });

  async function handleSubmitNotifications() {
    let notifications = {};
    notificationSettings.forEach((notification) => {
      if (notification.on) {
        notifications[notification.room] = notification.threshold;
      }
    });
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notifications: notifications,
        emailNotifications: emailsOn,
        smsNotifications: smsOn,
      }),
    };
    const response = await fetch(
      "/settings/notifications/update",
      requestOptions
    );
    if (!response.ok) {
      setAuthError(true);
      console.log("can't do that!");
    }
  }

  function displayError() {
    if (authError) {
      return (
        <div>
          <Alert
            onClose={() => setAuthError(false)}
            dismissible
            show={authError}
            key={0}
            variant="dark"
          >
            <Alert.Heading>It seems like you're not logged in.</Alert.Heading>
            <p>
              You can
              <Alert.Link href="/">log in</Alert.Link> if you already have an
              account or
              <Alert.Link href="/signup">create an account</Alert.Link>.
            </p>
          </Alert>
        </div>
      );
    }
  }

  return (
    <div style={{ margin: 10 }}>
      {displayError()}
      <FormCheck
        type="switch"
        label={<h4>Email Notifications</h4>}
        onChange={(e) => setEmailsOn(!emailsOn)}
        checked={emailsOn}
      />
      <FormCheck
        type="switch"
        label={<h4>SMS Notifications</h4>}
        onChange={(e) => setSmsOn(!smsOn)}
        checked={smsOn}
      />
      {/* <ReactSwitch
        onChange={(e) => toggleRoom("Room 1")}
        checked={!notificationSettings[0].on}
      /> */}
      {renderNotifications}

      <Button
        onClick={(e) => {
          e.preventDefault();
          handleSubmitNotifications();
        }}
      >
        Save
      </Button>
    </div>
  );
}

export default Settings;
