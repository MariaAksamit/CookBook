import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {Form, Navbar, Button, Table } from "react-bootstrap";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";

import CategoryEdit from "./CategoryEdit";
import CategoryCreate from "./CategoryCreate";
import styles from '../../styles/categoryList.module.css';

function CategoryList(props) {
  const [searchBy, setSearchBy] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalShown, setIsModalShown] = useState(false);
  
  const sortedCategories = useMemo(() =>
    props.categoryList
      .filter((item) =>
        item.name.toLowerCase().includes(searchBy.toLowerCase())
      )
      .sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      ), [props.categoryList, searchBy]);

  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    setIsModalShown(true);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  function handleSearch(event) {   
    event.preventDefault();
    setSearchBy(event.target["searchInput"].value);
  }

  function handleSearchDelete(event) {   
    if (!event.target.value) setSearchBy("");  
  }

return (
  <div>
    <Navbar collapseOnSelect expand="sm" bg="light">
      <div className="container-fluid">
        <Navbar.Brand>Seznam kategorii</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse style={{ justifyContent: "right" }}>
          <Form className="d-flex" onSubmit={handleSearch}>
            <Form.Control
              id={"searchInput"}
              style={{ maxWidth: "150px" }}
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={handleSearchDelete}
            />
            <Button
              style={{ marginRight: "8px" }}
              variant="outline-success"
              type="submit"
            >
            <Icon size={1} path={mdiMagnify} />
            </Button>
              <CategoryCreate 
                handleShowModal={handleOpenModal} 
                categoryList={props.categoryList}  
              />
          </Form>
        </Navbar.Collapse>
      </div>
    </Navbar> 
    
    <div>
      <Table striped bordered hover>
        <thead>
          <tr className={styles.colorText}>
            <th>Název kategorie</th>
          </tr>
        </thead>
        <tbody>
          {sortedCategories.length > 0 ? (
            sortedCategories.map((category) => (
              <tr key={category.id} className={styles.categoryList}>
                <td>
                  <Link to="#" onClick={() => handleCategoryClick(category)} className={styles.catNames}>
                    {category.name}
                  </Link>
                </td>
              </tr>
        ))
      ) : (
        <div style={{ margin: "16px auto", textAlign: "center" }}>
          Nejsou žádné kategorie ke zobrazení.
        </div>
      )}
        </tbody>
      </Table>
      <CategoryEdit
        category={selectedCategory}
        categoryList={props.categoryList}
        recipeList={props.recipeList}
        handleShowModal={handleOpenModal}
      />
    </div>
  </div> 
);
};

export default CategoryList;