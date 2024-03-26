import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {Form, Navbar, Button } from "react-bootstrap";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";

import IngredientEdit from "./IngredientEdit";
import IngredientCreate from "./IngredientCreate";
import styles from '../../styles/ingredientList.module.css';

function IngredientList(props) {
  const [searchBy, setSearchBy] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isModalShown, setIsModalShown] = useState(false);
  
  const sortedIngredients = useMemo(() =>
    props.ingredientList
      .filter((item) =>
        item.name.toLowerCase().includes(searchBy.toLowerCase())
      )
      .sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      ), [props.ingredientList, searchBy]);

  const handleOpenModal = (ingredient) => {
    setSelectedIngredient(ingredient);
    setIsModalShown(true);
  };

  const handleIngredientClick = (ingredient) => {
    setSelectedIngredient(ingredient);
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
        <Navbar.Brand>Seznam surovin</Navbar.Brand>
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
              <IngredientCreate 
                handleShowModal={handleOpenModal} 
                ingredientList={props.ingredientList}  
              />
          </Form>
        </Navbar.Collapse>
      </div>
    </Navbar> 
    
    <div className={styles.ingredientList}>
      {sortedIngredients.length > 0 ? (
        sortedIngredients.map((ingredient) => (
          <div key={ingredient.id} className={styles.ingredientList2}>
            <Link to="#" onClick={() => handleIngredientClick(ingredient)} className={styles.ingrNames}>
              {ingredient.name}
            </Link>
          </div>
        ))
      ) : (
        <div style={{ margin: "16px auto", textAlign: "center" }}>
          Nejsou žádné suroviny k zobrazení.
        </div>
      )}

      <IngredientEdit
        ingredient={selectedIngredient}
        ingredientList={props.ingredientList}
        recipeList={props.recipeList}
        handleShowModal={handleOpenModal}
      />
    </div>
  </div> 
);
};

export default IngredientList;