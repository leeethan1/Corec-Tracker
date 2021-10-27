import { React, useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useHistory } from "react-router";

function Header() {
  const history = useHistory();

  function signOut() {
    fetch("/logout")
      .then((res) => res.json())
      .then((response) => {
        localStorage.removeItem("access")
        localStorage.removeItem("remove")
      });
  }
  const rooms = [1, 2, 3, 4];

  function redirectToRoom(event, roomNumber) {
    event.preventDefault();
    history.push(`/room/${roomNumber}`);
  }

  function redirectToSettings() {
    history.push("/settings");
  }

  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand href="#home">Corec-Tracker</Navbar.Brand>
        <Nav className="core-nav">


          <Nav.Link href="/dashboard">Home</Nav.Link>
          {/* <Nav.Link href="/">Settings</Nav.Link> */}
          <Nav.Link href="/">
            <span onClick={signOut}>Logout</span>
          </Nav.Link>
          <Nav.Link href="/settings">
            <span onClick={redirectToSettings}>Settings</span>
          </Nav.Link>
          <DropdownButton title="Rooms">
            {rooms.map((roomNumber, index) => (
              <Dropdown.Item href="/">
                <span onClick={(e) => redirectToRoom(e, roomNumber)}>
                  Room {roomNumber}
                </span>
              </Dropdown.Item>
          ))}
          </DropdownButton>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
