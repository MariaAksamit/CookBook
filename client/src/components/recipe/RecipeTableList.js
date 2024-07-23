import React, { useState } from "react";
import { Modal } from 'react-bootstrap';
import Icon from "@mdi/react";
import { mdiTrashCanOutline } from "@mdi/js";

import RecipeDetail from "./RecipeDetail";
import RecipeEdit from "./RecipeEdit";
import RecipeDelete from "./RecipeDelete";

function RecipeTableList({ recipeList, ingredientList, categoryList }) {
  const [isModalShown, setShow] = useState(false);
  const [isDeleteModalShown, setDeleteModalShown] = useState(false);
  
  const handleCloseModal = () => setShow(false);
  const handleCloseDeleteModal = () =>  setDeleteModalShown(false);

return (
  <div>
    <br/>
   
    <table className={`table table-striped`}>
      <thead>
        <tr>
          <th scope="col">Kategorie</th>          
          <th scope="col">Název</th>
          <th scope="col">Postup</th>
          <th scope="col"> </th>
        </tr>
      </thead>
      <tbody>
        {recipeList.map((recipe) => {
          return (
            <tr key={recipe.id}>
              <td>{recipe.category}</td>
              <td>{recipe.name}</td>
              <td>{recipe.description.slice(0, 170)}</td>
              <td>
                <RecipeDetail
                  recipe={recipe}
                  ingredientList={ingredientList}
                />{" "} 
                <RecipeEdit
                  recipe={recipe}
                  ingredientList={ingredientList}
                  categoryList={categoryList}
                />{" "}
                <Modal show={isDeleteModalShown} onHide={handleCloseDeleteModal}>
                  <RecipeDelete 
                    onClose={handleCloseDeleteModal}
                    recipe={recipe} />
                </Modal>
                <Icon
                  path={mdiTrashCanOutline}
                  style={{ color: "grey", cursor: "pointer" }}
                  size={1}
                  onClick={() => {
                  handleCloseModal();
                  setDeleteModalShown(true)}}
                />                  
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
  );
};

export default RecipeTableList;