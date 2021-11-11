import React from "react";
import { useHistory } from "react-router-dom";
import Header from "./Header";
import { ChatEngine } from "react-chat-engine";
import ChatFeed from "./chat components/ChatFeed";

const projectID = "9e45fcff-6309-40db-b521-4ef91549ccd2";

function Chat() {
  let username = null;
  let secret = null;
  const history = useHistory();

  username = localStorage.getItem("remember")
    ? localStorage.getItem("username")
    : sessionStorage.getItem("username");

  secret = localStorage.getItem("remember")
    ? localStorage.getItem("password")
    : sessionStorage.getItem("password");

  if (!username && !secret) {
    history.push("/");
    return null;
  } else {
    return (
      <div>
        <Header />
        <ChatEngine
          height="100vh"
          projectID={projectID}
          userName={username}
          userSecret={secret}
          renderChatFeed={(chatAppProps) => <ChatFeed {...chatAppProps} />}
        />
      </div>
    );
  }
}

export default Chat;
