import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from 'react-bootstrap';
import Icon from "@mdi/react";
import { mdiPlus, mdiTrashCanOutline } from "@mdi/js";

import RecipeIngredientAdd from "./RecipeIngredientAdd";
import styles from "../../styles/recipeList.module.css";

export default function RecipeCreate ({ handleShowModal, ingredientList, categories }) {
  const [nameError, setNameError] = useState(null);
  const [descriptionError, setDescriptionError] = useState(null);
  const [isModalShown, setShow] = useState(false);
  const [recipeCall, setRecipeCall] = useState({ state: "pending" });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image: "",
    ingredients: [],
  });

  const handleCloseModal = () => setShow(false);
  const handleOpenModal = () => {
    handleShowModal();
    setShow(true);
  }

  useEffect(() => {
    if (isModalShown) handleOpenModal();
    }, [isModalShown]);

  const handleCreateRecipe = async (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
                   
      // Resetujte chyby pred každým overením
      setNameError(null);
      setDescriptionError(null);

      if (formData.name.length < 3 || formData.name.length > 50) {
        setNameError("Název musí mať délku 3 - 50 znaků.");
        return;
      }

      if (formData.description.length < 3 || formData.description.length > 1600) {
        setDescriptionError("Postup musí mať délku 3 - 1600 znaků.");
        return;
      }

      if (!formData.category) {
        alert("Vyberte prosím kategorii receptu.");
        return;
      }

      if (formData.ingredients.length === 0) {
        const confirmed = window.confirm("Recept neobsahuje žádné suroviny. Chcete přesto recept uložit?");
        if (!confirmed) {
          return;
        }
      }
      
      const newRecipe = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        image: formData.image,
        ingredients: formData.ingredients,
      };
    
      const response = await fetch("/recipe/create", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
      },
        body: JSON.stringify(newRecipe),
      });
    
      if (response.ok) {
        setShow(false);
      } else {
        const errorData = await response.json();
        setRecipeCall({ state: "error", error: errorData });
      };

      } catch (error) {
        setRecipeCall({ state: "error", error: error.message });
      } finally {
        //window.location.reload();
      }
  };
  
  const setField = (name, val) => {
    setFormData((formData) => {
    return { ...formData, [name]: val };
  });
  };

  const addIngredient = (newIngredient) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      ingredients: [...prevFormData.ingredients, newIngredient],
    }));
  };
    
  const newIngredientList = (removedIngredientId) => {
    const updatedIngredients = formData.ingredients.filter(
      (ingredient) => ingredient.id !== removedIngredientId
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      ingredients: updatedIngredients,
    }));
    };
      
  const deleteIngredient = (ingredientId) => {
    newIngredientList(ingredientId);
  };

return (
<>
  <Button 
    variant="success"
    onClick={handleOpenModal}>
    <Icon path={mdiPlus} size={1} />
      Create
  </Button>

  <Modal show={isModalShown} onHide={handleCloseModal}>
    <Modal.Header closeButton>
      <Modal.Title className={styles.colorText}>Vytvoření nového receptu: </Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <Form.Group> 
        <Form.Label className={`${styles.colorText} text-muted`}>Název</Form.Label> 
        <Form.Control 
          required 
          type="text" 
          placeholder="Název"
          value={formData.name} 
          onChange={(e) => setField("name", e.target.value)}
        /> 
       {nameError && (
        <Form.Text className="text-danger"> {nameError} </Form.Text>
        )}
      </Form.Group>
      <Form.Group> 
       <Form.Label className={`${styles.colorText} text-muted`}>Obrázek</Form.Label> 
        <Form.Control 
          type="text" 
          placeholder="URI obrázka"
          value={formData.image} 
          onChange={(e) => setField("image", e.target.value)}
       /> 
      </Form.Group>
      <Form.Group> 
        <Form.Label className={`${styles.colorText} text-muted`}>Kategorie</Form.Label> 
        <Form.Control 
          as="select" 
          value={formData.category} 
          onChange={(e) => {setField("category", e.target.value)}}                            
          required 
        > 
        <option value="" disabled hidden> Vybrat kategorii </option>
          {categories.map((category) => (
        <option key={category} value={category}> {category} </option>
        ))}
        </Form.Control>
      </Form.Group>
      <Form.Group> 
        <Form.Label className={`${styles.colorText} text-muted`}>Postup</Form.Label> 
        <Form.Control 
          as="textarea" 
          placeholder="Postup"
          style={{ height: '300px', overflow: 'auto' }}
          value={formData.description} 
          onChange={(e) => setField("description", e.target.value)}
          required 
        />
        {descriptionError && (
        <Form.Text className="text-danger"> {descriptionError} </Form.Text>
        )} 
      </Form.Group>
      <Table striped bordered hover>
        <thead>
          <tr className={styles.colorText}>
            <th>Název suroviny</th>
            <th>Množství</th>
            <th>Jednotka</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {formData.ingredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td>{ingredient.name}</td>
              <td>{ingredient.amount}</td>
              <td>{ingredient.unit}</td>
              <td>
                <Icon
                  onClick={() => deleteIngredient(ingredient.id)}
                  path={mdiTrashCanOutline}
                  style={{ cursor: 'pointer', color: 'grey' }}
                  size={0.8}
                ></Icon>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <RecipeIngredientAdd 
        handleShowModal={handleOpenModal}
        addIngredient={addIngredient}
        ingredientList={ingredientList}
        recipeIngredients={formData.ingredients}
      />
  </Modal.Body>
        
  <Modal.Footer>
    <Button 
      variant="primary"
      style={{ marginLeft: "8px" }}
      onClick={handleCreateRecipe} 
    >
      Uložit
    </Button>
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
};