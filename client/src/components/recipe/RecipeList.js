import React, { useState, useMemo } from "react";
import { Button, Form, Navbar } from 'react-bootstrap';
import Icon from "@mdi/react";
import { mdiTable, mdiViewGridOutline, mdiMagnify } from "@mdi/js";

import styles from "../../styles/recipeList.module.css";
import RecipeGridList from "./RecipeGridList";
import RecipeTableList from "./RecipeTableList";
import RecipeCreate from "./RecipeCreate";

function RecipeList({ recipeList, ingredientList, categoryList, selectedCategory }) {
  const [isModalShown, setIsModalShown] = useState(false);  // Pridaný stav pre zobrazenie modálneho okna
  const [viewType, setViewType] = useState("grid");
  const isGrid = viewType === "grid";
  const [searchBy, setSearchBy] = useState("");
 
  const handleOpenModal = () => setIsModalShown(true);

  function filterRecipesByCategory(recipeList, selectedCategory) {
    if (!selectedCategory) {
      return recipeList;
    }
    // Vyfiltruj recepty, ktoré majú zhodnú kategóriu s selectedCategory.name
    const filteredRecipes = recipeList.filter((recipe) => {
      return recipe.category === selectedCategory.name;
    });
    return filteredRecipes;
  };
  
  const filteredRecipeList = useMemo(() => {
    const recipesByCategory = filterRecipesByCategory(recipeList, selectedCategory);
    const filteredRecipes = recipesByCategory.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchBy.toLowerCase()) ||
        item.description.toLocaleLowerCase().includes(searchBy.toLowerCase())
      );
    });
    return filteredRecipes;
  }, [recipeList, searchBy, selectedCategory]);
  
  function handleSearch(event) {   // funkce, kterou budeme spoustět na "odeslání" formuláře, tedy na stisknutí tlačítka vyhledat
    event.preventDefault();
    setSearchBy(event.target["searchInput"].value);
  };

  function handleSearchDelete(event) {   // funkce, která se bude spouštět při změně hodnoty vstupu pro vyhledávání
    if (!event.target.value) setSearchBy("");  // pokud ve vstupu nebude hodnota (uživatel stiskne x), bude zrušeno vyhledávání
  };

return (
  <div>
    <Navbar collapseOnSelect expand="sm" bg="light">
      <div className="container-fluid">
      <Navbar.Brand>Seznam receptů</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse style={{ justifyContent: "flex-end" }}>
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
      </Form>
        <Button
          className={"d-none d-md-block"}
          variant="outline-primary"
          onClick={() =>
            setViewType((currentState) => currentState === "grid" ? "table" : "grid")
          }
        >
          <Icon size={1} path={isGrid ? mdiTable : mdiViewGridOutline} />{" "}
            {isGrid ? "Tabulka" : "Grid"}
        </Button>
        <RecipeCreate 
          handleShowModal={handleOpenModal}
          ingredientList={ingredientList}
          categoryList={categoryList}
        />
      </Navbar.Collapse>
      </div>
    </Navbar>
      
    <div className={styles.recipeList}>
      {filteredRecipeList.length ? (
        <div className="container">
        <div className={"d-block d-md-none"}>
          <RecipeGridList recipeList={filteredRecipeList} ingredientList={ingredientList} categoryList={categoryList}/>
        </div>
        <div className={"d-none d-md-block"}>
          {isGrid ? (
            <RecipeGridList recipeList={filteredRecipeList} ingredientList={ingredientList} categoryList={categoryList}/>
          ) : (
            <RecipeTableList recipeList={filteredRecipeList} ingredientList={ingredientList} categoryList={categoryList}/>
          )}
        </div>
    </div>

    ) : (

    <div style={{ margin: "16px auto", textAlign: "center" }}>
      Nejsou žádné recepty ke zobrazení.
    </div>
    )}
    </div>
  </div>
);
};

export default RecipeList;