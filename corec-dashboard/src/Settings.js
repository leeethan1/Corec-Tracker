import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, FormCheck, Alert } from "react-bootstrap";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";

function Settings() {
  const [emailsOn, setEmailsOn] = useState(true);
  const [smsOn, setSmsOn] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [showToolTip, setShowToolTip] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  //const Slider = require("rc-slider");
  //const sliderWithTooltip = Slider.createSliderWithTooltip;
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
      <div style={{ "margin-bottom": 40 }}>
        <FormCheck
          type="switch"
          label={notification.room}
          onChange={(e) => {
            toggleRoom(notification.room);
          }}
          checked={notification.on}
          disabled={!emailsOn && !smsOn}
        />

        <label>
          <div className="rowC">
            <p>
              Threshold:
              <b>{notification.threshold}</b>
            </p>
            <Slider onChange={(e) => changeThreshold(notification.room, e)} disabled={!notification.on || (!emailsOn && !smsOn)}/>
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
      const res = await response.json();
      console.log(res);
      console.log("can't do that!");
    } else {
      setSettingsSaved(true);
    }
  }

  function showSuccessful() {
    if (settingsSaved) {
      return (
        <div>
          <Alert
            onClose={() => setSettingsSaved(false)}
            dismissible
            show={settingsSaved}
            key={0}
            variant="success"
          >
            <p>Saved.</p>
          </Alert>
        </div>
      );
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
            variant="danger"
          >
            <Alert.Heading>
              Oops! It seems like you're not logged in.
            </Alert.Heading>
            <p>
              You can <Alert.Link href="/">log in</Alert.Link> if you already
              have an account or{" "}
              <Alert.Link href="/signup">create an account</Alert.Link>.
            </p>
          </Alert>
        </div>
      );
    }
  }

  return (
    <div>
      <Header />
      <div style={{ margin: 10 }}>
        {displayError()}
        {showSuccessful()}
        <h1>Settings</h1>
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
        <p>Receive notifications for...</p>
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
    </div>
  );
}

export default Settings;