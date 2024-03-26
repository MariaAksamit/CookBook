import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from 'react-bootstrap';
import Icon from "@mdi/react";
import { mdiPencilOutline, mdiTrashCanOutline } from "@mdi/js";

import RecipeIngredientAdd from "./RecipeIngredientAdd";
import styles from "../../styles/recipeList.module.css";

export default function RecipeEdit ({ recipe, ingredientList, categories, onClose, isEditModalShown }) {
  const [validated, setValidated] = useState(false);
  const [recipeEditCall, setRecipeEditCall] = useState({ state: "pending" });
  const [isModalShown, setShow] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useState([]); // Nový state pre sledovanie vybraných surovín
  const initialIngredients = recipe
    ? recipe.ingredients.map(ingredient => ({
        id: ingredient.id || "",
        name: ingredientList.find(item => item.id === ingredient.id)?.name || "",
        amount: ingredient.amount || "",
        unit: ingredient.unit || "",
      }))
    : [];
  const [formData, setFormData] = useState({
    name: recipe ? recipe.name : "",
    description: recipe ? recipe.description : "",
    category: recipe ? recipe.category : "",
    image: recipe ? recipe.image : "",
    ingredients: initialIngredients,
  });
  
  const handleCloseModal = () => {
    setShow(false);
    isEditModalShown = false;
  };

  const handleShowModal = () => {
    setFormData((prevFormData) => {
      const updatedIngredients = recipe
        ? recipe.ingredients.map((ingredient) => ({
            id: ingredient.id || "",
            name: ingredientList.find((item) => item.id === ingredient.id)?.name || "",
            amount: ingredient.amount || "",
            unit: ingredient.unit || "",
          }))
        : [];
    return {
      ...prevFormData,
      ingredients: updatedIngredients,
    };
    });
    setShow(true);
  };

 useEffect(() => {
    if (isEditModalShown) {
      setShow(true);
    }
  }, [isEditModalShown]);

  const handleEditRecipe = async (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();

      const form = e.currentTarget;
      setValidated(true);

      if (!form.checkValidity()) {
        return;
      }      
      
      // Kontrola duplicity surovín podľa názvu
      const uniqueIngredientNames = new Set();
      const hasDuplicateIngredientNames = formData.ingredients.some((ingredient) => {
        const ingredientName = ingredient.name.toLowerCase();
        if (uniqueIngredientNames.has(ingredientName)) {
          // Nastav validated na false při detekci duplicity
          setValidated(false);
          return true;
        }
        uniqueIngredientNames.add(ingredientName);
        return false;
      });

      if (hasDuplicateIngredientNames) {
        alert("Surovina už v receptu existuje. Vyberte jinou surovinu.");
        return;
      }
      
      if (formData.ingredients.length === 0) {
        const confirmed = window.confirm("Recept neobsahuje žádné suroviny. Chcete přesto recept uložit?");
        if (!confirmed) {
          return;
        }
      }

    const updatedRecipe = {
      id: recipe.id,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      image: formData.image,
      ingredients: formData.ingredients.map(({ id, amount, unit }) => ({
        id,
        amount,
        unit,
      })),
    };      
      
    // Volání API na server pro aktualizaci receptu
    const response = await fetch("/recipe/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRecipe),
    });

    if (!form.checkValidity()) {
      setValidated(true);
    return;
    }
      
    if (response.ok) {
      setShow(false);
    } else {
      const errorData = await response.json();
      setRecipeEditCall({ state: "error", error: errorData });
    }
    } catch (error) {
      setRecipeEditCall({ state: "error", error: error.message });
    } finally {
      if (onClose) onClose();
    }
  };

  const getTableValues = (ingredientId) => {
    const ingredient = formData.ingredients.find((item) => item.id === ingredientId);
    return {
      name: ingredient?.name || "",
      amount: ingredient?.amount || "",
      unit: ingredient?.unit || "",
    };
  };

  const setTable = (ingredientId, updatedValues) => {
    const newIngredientId = ingredientList.find(ingredient => ingredient.name === updatedValues.name)?.id || "";
      // Kontrola duplicít vo vybraných surovinách
    const isDuplicateInSelected = selectedIngredients.some(
      (ingredient) => ingredient.id !== ingredientId && ingredient.name.toLowerCase() === updatedValues.name.toLowerCase()
    );
      // Kontrola duplicít v existujúcich surovinách v tabuľke
    const isDuplicateInTable = formData.ingredients.some(
      (ingredient) => ingredient.id !== ingredientId && ingredient.name.toLowerCase() === updatedValues.name.toLowerCase()
    );
    if (isDuplicateInSelected || isDuplicateInTable) {
      alert("Vybraná surovina již v tabulce existuje. Vyberte jinou surovinu.");
      return;
    }
    setFormData((prevFormData) => {
      const newIngredients = prevFormData.ingredients.map((ingredient) => {
        if (ingredient.id === ingredientId) {
          return {
            ...ingredient,
            id: newIngredientId,
            name: updatedValues.name,
            amount: updatedValues.amount,
            unit: updatedValues.unit,
          };
        }
        return ingredient;
      });
      return {
        ...prevFormData,
        ingredients: newIngredients,
      };
    });
      // Aktualizácia vybraných surovín
    const updatedSelectedIngredients = selectedIngredients.map((ingredient) =>
      ingredient.id === ingredientId
        ? { ...ingredient, name: updatedValues.name }
        : ingredient
    );
    setSelectedIngredients(updatedSelectedIngredients);
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

  const deleteIngredient = (ingredientId) => {
    setFormData((formData) => ({
      ...formData,
      ingredients: formData.ingredients.filter((ingredient) => ingredient.id !== ingredientId),
    }));
  };
  
return (
<>
<Icon
    path={mdiPencilOutline}
    style={{ color: "grey", cursor: "pointer" }}
    size={1}
    onClick={handleShowModal}
/>

<Modal show={isModalShown} onHide={handleCloseModal}>
  <Form noValidate validated={validated} onSubmit={handleEditRecipe}>

    <Modal.Header closeButton>
      <Modal.Title className={styles.colorText}>Editace receptu: </Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <Form.Group> 
        <Form.Label className={`${styles.colorText} text-muted`}>Název</Form.Label> 
        <Form.Control 
          required 
          type="text" 
          value={formData.name} 
          onChange={(e) => setField("name", e.target.value)}
          minLength={3}
          maxLength={50}
        /> 
        <Form.Control.Feedback type="invalid"> 
          Název musí mít délku 3–50 znaků.
        </Form.Control.Feedback> 
      </Form.Group>
      <Form.Group> 
        <Form.Label className={`${styles.colorText} text-muted`}>Obrázek</Form.Label> 
        <Form.Control 
          type="text" 
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
            style={{ height: '300px', overflow: 'auto' }}
            value={formData.description} 
            onChange={(e) => setField("description", e.target.value)}
            required 
          /> 
        <Form.Control.Feedback type="invalid"> 
          Postup musí mít délku 3–1600 znaků.
        </Form.Control.Feedback> 
      </Form.Group>
      <div>
        <span className={`${styles.colorText} text-muted`}>Suroviny pro počet porcí: 1</span>
      <br />
      </div>
      <div>
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
            {formData.ingredients.map((ingredient) => {
              const cellValues = getTableValues(ingredient.id);
                return (
                  <tr key={ingredient.id}>
                    <td>
                      <Form.Control 
                        as="select"
                        value={cellValues.name}
                        onChange={(e) => {setTable(ingredient.id, { ...cellValues, name: e.target.value })}}                            
                        required 
                      > 
                        <option value="" disabled hidden> Vybrat surovinu </option>
                          {ingredientList
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((ingredient) => (
                        <option key={ingredient.id} value={ingredient.name}> {ingredient.name} </option>
                        ))}
                      </Form.Control>
                    </td>
                    <td>
                    <Form.Control 
                        type="number" 
                        value={cellValues.amount}
                        onChange={(e) => {
                          const newAmount = e.target.value;
                          if (newAmount < 0) {
                            alert("Množství suroviny nemůže být záporné.");
                            return;
                          }
                          setTable(ingredient.id, { ...cellValues, amount: newAmount });
                        }}
                        required 
                      /> 
                    </td>
                    <td>
                      <Form.Control 
                        type="text" 
                        value={cellValues.unit}
                        onChange={(e) => setTable(ingredient.id, { ...cellValues, unit: e.target.value })}
                        maxLength={10}
                        required 
                      /> 
                    </td>
                    <td>
                      <Icon
                        onClick={() => deleteIngredient(ingredient.id)}
                        path={mdiTrashCanOutline}
                        style={{ cursor: 'pointer', color: 'grey' }}
                        size={0.8}
                      ></Icon>
                    </td>
                  </tr>
                  );
                })}
          </tbody>
        </Table>
        <RecipeIngredientAdd 
          handleShowModal={handleShowModal}
          addIngredient={addIngredient}
          ingredientList={ingredientList}
          recipeIngredients={formData.ingredients}
        />
        </div>   
    </Modal.Body>

    <Modal.Footer>
      <Button 
        variant="primary"
        style={{ marginLeft: "8px"}}
        onClick={handleEditRecipe} >
          Uložit
      </Button>
      <Button 
        variant="outline-secondary"
        style={{ marginLeft: "8px"}}
        onClick={onClose}>
        Zavřít
      </Button>  
    </Modal.Footer>
  </Form>
</Modal>
</>
);
};