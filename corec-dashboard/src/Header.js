import {React, useEffect, useState} from "react";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

function Header() {
  function signOut() {
    fetch('/logout')
    .then(res => res.json())
    .then((response) => {
      if (response.message) {
        console.log(response);
      }
    });
  }
  return (
    <Navbar bg="light" variant="light">
      <Container>
      <Navbar.Brand href="#home">Corec-Tracker</Navbar.Brand>
      <Nav className="core-nav">
        <Nav.Link href="/dashboard">Home</Nav.Link>
        {/* <Nav.Link href="/">Settings</Nav.Link> */}
        <Nav.Link href="/"><span onClick={signOut}>Logout</span></Nav.Link>
      </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
