import { React, useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useHistory } from "react-router";

function Header() {
  const history = useHistory();

  async function signOut() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access: localStorage.getItem("access"),
      },
    };
    const response = await fetch(`/logout`, requestOptions);
    if (response.ok) {
      //console.log(averages);
      //console.log(occupancies);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      history.push("/");
    }
  }
  const rooms = ["Room 1", "Room 2", "Room 3", "Room 4"];

  function redirectToRoom(room) {
    history.push(`/room/${encodeURIComponent(room)}`);
  }

  function redirectToSettings() {
    history.push("/settings");
  }

  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand href="/dashboard">
          <b>Corec Tracker</b>
        </Navbar.Brand>
        <Nav className="core-nav">
          <Nav.Link href="/dashboard">Home</Nav.Link>
          <Nav.Link href="/">Log In</Nav.Link>
          <Nav.Link href="/signup">Sign Up</Nav.Link>

          {/* <Nav.Link href="/">Settings</Nav.Link> */}
          <Nav.Link>
            <span onClick={() => signOut()}>Logout</span>
          </Nav.Link>
          <Nav.Link href="/settings">
            <span>Settings</span>
          </Nav.Link>
          <DropdownButton title="Rooms">
            {rooms.map((room, index) => (
              <Dropdown.Item href={`/room/${encodeURIComponent(room)}`}>
                <span>{room}</span>
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
