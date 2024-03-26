import './App.css';
import React from "react";
import { Outlet, useNavigate, useState } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Offcanvas from "react-bootstrap/Offcanvas";

function App() {
  let navigate = useNavigate();

  return (
    <div className="App">
    <Navbar
      fixed="top"
      expand={"sm"}
      className="mb-3"
      bg="dark"
      variant="dark"
    >
    <Container fluid>
      <Navbar.Brand onClick={() => navigate("/")}>  Kuchařská kniha  </Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} />
          <Navbar.Offcanvas id={`offcanvasNavbar-expand-sm`}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
              Kuchařská kniha
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link href="/recipeList">  Recepty  </Nav.Link>
                <Nav.Link href="/ingredientList">  Suroviny   </Nav.Link>
              </Nav>

            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
  
      <Outlet />
    </div>
  );
}

export default App;