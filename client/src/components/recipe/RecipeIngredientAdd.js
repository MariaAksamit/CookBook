import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import styles from "../../styles/recipeList.module.css";

export default function RecipeAddIngredient ({ handleShowModal, addIngredient, ingredientList, recipeIngredients }) {
  const [isModalShown, setShow] = useState(false);
  const [ingredientCall, setIngredientCall] = useState({ state: "pending" });
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    unit: "",
  });

  const handleCloseModal = () => setShow(false);
  const handleOpenModal = () => {
    handleShowModal();
    setShow(true);
  }

  useEffect(() => {
    if (isModalShown) handleOpenModal();
  }, [isModalShown]);

  const handleSaveIngredient = () => {
    // Validace formuláře
    if (!formData.selectedIngredient || !formData.amount || !formData.unit) {
      alert("Vyplň všechna pole.");
    return;
    }
   
    // Získání informací o vybrané surovině
    const selectedIngredient = ingredientList.find(
      (ingredient) => ingredient.name === formData.selectedIngredient
    );
        
    // Kontrola duplicity
    const isDuplicate = recipeIngredients.some(
      (ingredient) => ingredient.id === selectedIngredient.id
    );
        
    const newIngredient = {
      id: selectedIngredient.id,
      name: formData.selectedIngredient,
      amount: formData.amount,
      unit: formData.unit,
    };
    
    if (!isDuplicate) {
      addIngredient(newIngredient);
      setShow(false);
    } else {
      alert("Surovina se stejným ID již existuje v receptu.");
      return;
    };

    setShow(false);
  };
    
  const setField = (name, val) => {
    setFormData((formData) => {
    return { ...formData, [name]: val };
    });
  };
   
return (
<>
  <Button 
    variant="success"
    style={{ marginLeft: 'auto', display: 'block' }} 
    onClick={handleOpenModal}>
    <Icon path={mdiPlus} size={1} />
  </Button>

  <Modal show={isModalShown} onHide={handleCloseModal}>
    <Modal.Header closeButton>
      <Modal.Title className={styles.colorText}>Přidání nové suroviny: </Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <Form.Group>
        <Form.Label className={`${styles.colorText} text-muted`}>Vybrat surovinu</Form.Label>
        <Form.Control
          as="select"
          defaultValue={formData.name}
          value={formData.selectedIngredient}
          onChange={(e) => setField("selectedIngredient", e.target.value)}
          required
        >
        <option value="" disabled hidden> Vybrat surovinu </option>
        {ingredientList
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((ingredient) => (
        <option key={ingredient.id} value={ingredient.name}> {ingredient.name} </option>
        ))}
        </Form.Control>
      </Form.Group>
      <Form.Group> 
        <Form.Control 
          type="number" 
          placeholder="Množství"
          value={formData.amount}
          onChange={(e) => {
            const newAmount = e.target.value;
            if (newAmount < 0) {
              alert("Množství suroviny nemůže být záporné.");
              return;
            }
           setField("amount", newAmount);
          }}
          required
        /> 
      </Form.Group>
      <Form.Group> 
        <Form.Control 
          type="text" 
          placeholder="Jednotka"
          value={formData.unit}
          onChange={(e) => setField("unit", e.target.value)}
          maxLength={10}
          required
        /> 
      </Form.Group>
    </Modal.Body>
        
    <Modal.Footer>
      <Button 
        variant="primary"
        style={{ marginLeft: "8px" }}
        onClick={handleSaveIngredient} 
      >
        Uložit
      </Button>
      <Button 
        variant="secondary-outline"
        style={{ marginLeft: "8px"}}
        onClick={handleCloseModal} 
      >
        Zavřít
      </Button>  
    </Modal.Footer>
  </Modal>
</>
);
};