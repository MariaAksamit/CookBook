import React, { useState, useMemo } from "react";
import Icon from "@mdi/react";
import { Modal, Table, Button } from 'react-bootstrap';
import { mdiEyeOutline } from "@mdi/js";
import styles from "../../styles/recipeList.module.css";

function RecipeDetail({ recipe, ingredientList }) {
  const [isModalShown, setShow] = useState(false);
  const [portionCount, setPortionCount] = useState(1);
  
  const handleShowModal = () => setShow(true);
  const handleCloseModal = () => setShow(false);

  const getIngredientNames = () => {
    return ingredientList.reduce((acc, ingredient) => {
      acc[ingredient.id] = ingredient.name;
      return acc;
    }, {});
  };

 const ingredientNames = useMemo(() => getIngredientNames(), [ingredientList]);

 return (
    
    <>
      <Icon
        path={mdiEyeOutline}
        style={{ color: "grey", cursor: "pointer" }}
        size={1}
        onClick={handleShowModal}
      />

      <Modal show={isModalShown} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title className={styles.colorText}>Detail receptu: </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div>
            <div>
              <span className={`${styles.colorText} text-muted`}>Název: </span>
              <b>{recipe.name}</b>
            </div>
            <div>
            <img 
              src={recipe.image} 
              alt={recipe.name} 
              className="img-fluid"
              style={{ objectFit: 'cover' }} 
            />
            </div>
            <div>
              <span className={`${styles.colorText} text-muted`}>Kategorie: </span> 
              {recipe.category}
            </div>
            <div>
              <span className={`${styles.colorText} text-muted`}>Postup: </span> 
              <br />
              {recipe.description}
            </div>
            <div>
              <span className={`${styles.colorText} text-muted`}>Suroviny pro počet porcí: </span>
              <br />
              <span style={{ fontSize: '0.66em' }}> Zadajte hodnoty od 1 do 1000 </span>
              <br />
              <input
                type="number"
                value={portionCount}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10);
                  if (!isNaN(newValue) && newValue >= 1 && newValue <= 1000) {
                    setPortionCount(Math.min(Math.max(newValue, 1), 1000));
                  }
                }} />
            </div>
            <div>
              <Table striped bordered hover>
                <thead>
                  <tr className={styles.colorText}>
                    <th>Název suroviny</th>
                    <th>Množství</th>
                    <th>Jednotka</th>
                  </tr>
                </thead>
                <tbody>
                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                  recipe.ingredients.map((ingredient) => {
                    const matchingIngredientName = ingredientNames[ingredient.id];
                    const adjustedAmount = matchingIngredientName
                    ? (ingredient.amount * portionCount).toFixed(2)
                    : ingredient.amount;
                      return (
                        <tr key={ingredient.id}>
                          <td>{matchingIngredientName}</td>
                          <td>{adjustedAmount}</td>
                          <td>{ingredient.unit}</td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan="3">Žádné suroviny k zobrazení.</td>
                  </tr>
                )}
                </tbody>
              </Table>
              </div>   
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="secondary-outline"
            style={{ marginLeft: "8px" }}
            onClick={handleCloseModal} 
          >
            Zavřít
          </Button>  
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default RecipeDetail;