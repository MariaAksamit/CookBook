import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from 'react-bootstrap/Dropdown';
import Container from "react-bootstrap/Container";
import Offcanvas from "react-bootstrap/Offcanvas";
import './App.css';
import { useCategory } from './routes/SelectedCategoryContext';

function App() {
  let navigate = useNavigate();
  const [categoryList, setCategoryList] = useState([]);
  const { selectedCategory, setCategory } = useCategory();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/category/list')
       .then(response => response.json())
       .then(data => setCategoryList(data))
       .catch(error => console.error('Error fetching category data:', error));
   }, []); 

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
                <NavDropdown title="Recepty" id="navbarScrollingDropdown">
                  <NavDropdown.Item 
                      onClick={() => {
                        setCategory(null);
                        navigate("/recipeList")
                      }}
                    >
                      Všechny recepty
                    </NavDropdown.Item>
                    <Dropdown.Divider />
                    {categoryList
                      .sort((a, b) => a.name.localeCompare(b.name)) // Zoradenie podľa abecedy
                      .map((category) => (
                    <NavDropdown.Item
                      key={category.id}
                      onClick={() => {
                        setCategory(category);
                        navigate("/recipeList?id=" + category.id);
                      }}
                      >
                      {category.name}
                    </NavDropdown.Item>
                     ))}
                </NavDropdown>
                <Nav.Link onClick={() => navigate("/ingredientList")}>  Suroviny   </Nav.Link>
                <Nav.Link onClick={() => navigate("/categoryList")}>  Kategorie   </Nav.Link>
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
