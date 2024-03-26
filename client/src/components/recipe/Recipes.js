import React, { useState } from "react";
import { Modal, Card } from 'react-bootstrap';
import Icon from "@mdi/react";
import { mdiTrashCanOutline } from "@mdi/js";

import styles from "../../styles/recipeList.module.css";
import RecipeDetail from "./RecipeDetail";
import RecipeEdit from "./RecipeEdit";
import RecipeDelete from "./RecipeDelete";


function Recipes({ recipe, ingredientList, categories }) {
  const [isModalShown, setShow] = useState(false);
  const [isDeleteModalShown, setDeleteModalShown] = useState(false);
  const [isEditModalShown, setEditModalShown] = useState(false);
  
  const handleCloseModal = () => setShow(false);
  const handleCloseDeleteModal = () =>  setDeleteModalShown(false);

return (
  <Card className={styles.recipeCard}>
    <Card.Body>
      <img 
        src={recipe.image} 
        alt={recipe.name} 
        className="img-fluid"
        style={{ objectFit: 'cover' }} 
      />

      <div style={{ textAlign: 'right' }}> 
        <RecipeDetail
          recipe={recipe}
          ingredientList={ingredientList}
          categories={categories}
        />{" "}         
        <RecipeEdit
          recipe={recipe}
          ingredientList={ingredientList}
          categories={categories}
          isEditModalShown={isEditModalShown}
          onClose={() => setEditModalShown(false)}
        />{" "}               
 
      <Modal show={isDeleteModalShown} onHide={handleCloseDeleteModal}>
        <RecipeDelete 
          onClose={handleCloseDeleteModal}
          recipe={recipe} 
        />
      </Modal>
      <Icon
        path={mdiTrashCanOutline}
        style={{ color: "grey", cursor: "pointer" }}
        size={1}
        onClick={() => {
          handleCloseModal();
          setDeleteModalShown(true)}}
      />   
      </div>
      <div>
      <br />
        <strong> {recipe.name} </strong> <br /> 
        {recipe.description}
      </div>
    </Card.Body>
  </Card>
);
};

export default Recipes;