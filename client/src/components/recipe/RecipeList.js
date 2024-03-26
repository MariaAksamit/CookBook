import React, { useState, useMemo } from "react";
import { Button, Form, Navbar } from 'react-bootstrap';
import NavDropdown from "react-bootstrap/NavDropdown";
import Icon from "@mdi/react";
import { mdiTable, mdiViewGridOutline, mdiMagnify } from "@mdi/js";

import styles from "../../styles/recipeList.module.css";
import RecipeGridList from "./RecipeGridList";
import RecipeTableList from "./RecipeTableList";
import RecipeCreate from "./RecipeCreate";

function RecipeList({ recipeList, ingredientList }) {
  const [isModalShown, setIsModalShown] = useState(false);  // Pridaný stav pre zobrazenie modálneho okna
  const [viewType, setViewType] = useState("grid");
  const isGrid = viewType === "grid";
  const [searchBy, setSearchBy] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All"); 
  const categories = ["All", "Hlavní jídlo", "Polévky", "Saláty", "Dezerty", "Nápoje", "Něco na zub"];

 
  const handleOpenModal = () => setIsModalShown(true);

  function filterRecipesByCategory(recipeList, selectedCategory) {
    if (!selectedCategory || selectedCategory === "All") {
      return recipeList;
    }
    const filteredRecipes = recipeList.filter((recipe) => {
      return recipe.category === selectedCategory;
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
      <Navbar.Brand>         
        {selectedCategory === "All" ? "Seznam receptů" : selectedCategory}
      </Navbar.Brand>
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
      <NavDropdown
        title={<Button variant="outline-secondary">
         {selectedCategory === "All" ? "Všechny recepty" : selectedCategory}
          </Button>}
            id="basic-nav-dropdown"
            onSelect={(selectedKey) => setSelectedCategory(selectedKey)}
            style={{ marginRight: "8px" }}
          >
          {categories.map(category => (
            <NavDropdown.Item key={category} eventKey={category}>{category}</NavDropdown.Item>
              ))}
      </NavDropdown>
        <Button
          className={"d-none d-md-block"}
          variant="outline-primary"
          style={{ marginRight: "8px" }}
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
          categories={categories}
        />
      </Navbar.Collapse>
      </div>
    </Navbar>
      
    <div className={styles.recipeList}>
      {filteredRecipeList.length ? (
        <div className="container">
        <div className={"d-block d-md-none"}>
          <RecipeGridList recipeList={filteredRecipeList} ingredientList={ingredientList} categories={categories}/>
        </div>
        <div className={"d-none d-md-block"}>
          {isGrid ? (
            <RecipeGridList recipeList={filteredRecipeList} ingredientList={ingredientList} categories={categories}/>
          ) : (
            <RecipeTableList recipeList={filteredRecipeList} ingredientList={ingredientList} categories={categories}/>
          )}
        </div>
    </div>

    ) : (

    <div style={{ margin: "16px auto", textAlign: "center" }}>
      Nejsou žádné recepty k zobrazení.
    </div>
    )}
    </div>
  </div>
);
};

export default RecipeList;