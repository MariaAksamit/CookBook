import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from 'react-bootstrap';

import styles from "../../styles/recipeList.module.css";
import IngredientDelete from "./IngredientDelete";

export default function IngredientEdit ({ ingredient, ingredientList, recipeList, handleShowModal }) {
  const [isModalShown, setShow] = useState(false);
  const [ingredientEditCall, setIngredientEditCall] = useState({ state: "pending" });
  const [duplicateError, setDuplicateError] = useState(null);
  const [isDeleteModalShown, setDeleteModalShown] = useState(false);
  const [formData, setFormData] = useState({ name: ingredient ? ingredient.name : "" });

  const handleCloseModal = () => {
    setFormData({ name: ingredient ? ingredient.name : "" });
    setShow(false);
    setDuplicateError(null); // Resetuje chybovú správu duplicity pri zatváraní modálneho okna
  }

  const handleOpenModal = () => {
    handleShowModal(ingredient); // Zavoláme handleShowModal z rodičovskej komponenty
    setFormData({ name: ingredient ? ingredient.name : "" });
    setShow(true);
  };

  useEffect(() => {
    // Ak existuje surovina, otvorme modálne okno pri načítaní komponenty
    if (ingredient) {
      handleOpenModal();
    }
  }, [ingredient]);

  const handleDeleteIngredient =() => setDeleteModalShown(true);
  
  const handleEditIngredient = async(e) => {
    try {

      const form = e.currentTarget;
  
      e.preventDefault();
      e.stopPropagation();

      const isDuplicate = checkForDuplicate(formData.name);

      if (isDuplicate) {
        setDuplicateError("Název suroviny již existuje. Zvolte jiný název.");
      return;
      } 

      // Kontrola počtu znakov v názve suroviny (2-50) a nechcených znakov
      const validCharactersRegex = /^[a-zA-Z0-9\s-,áäéěíýóúůčďňšťžľĺřŕÁÉÍÝÓÚŮČĎŇŠŤŽĽĹŘŔ]+$/; // Povolené sú písmená, číslice, medzery a pomlčky

      // Kontrola počtu znakov v názve suroviny (2-50)
      if (formData.name.length < 2 || formData.name.length > 25 || !validCharactersRegex.test(formData.name)) {
        setDuplicateError("Zadejte název suroviny o délce 2 až 25 povolených znaků (písmena, číslice, mezery a pomlčky).");
      return;
      }
      const updatedIngredient = {
        name: formData.name,
        id: ingredient.id,
      };
  
   // Volání API na server pro aktualizaci receptu
   const response = await fetch("/ingredient/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedIngredient),
    });
  
    if (response.ok) {
      setShow(false);

    } else {
      const errorData = await response.json();
      setIngredientEditCall({ state: "error", error: errorData });
    }

    } catch (error) {
      console.error("Chyba ve funkci handleEditIngredient:", error);
      setIngredientEditCall({ state: "error", error: error.message });
    } finally {
      //window.location.reload();
    }
  };
  
  useEffect(() => {
    setFormData({ name: ingredient ? ingredient.name : "" });
  }, [ingredient]);

  const setField = (name, val) => {
    setFormData((formData) => {
      return { ...formData, [name]: val };
    });
  };

  // Funkcia na kontrolu duplicity
  const checkForDuplicate = (name) => {
    const existingIngredients = ingredientList.map((item) =>
      item.name.toLowerCase()
    );
    return existingIngredients.includes(name.toLowerCase());
  };

return (
<>
  <Modal show={isModalShown} onHide={handleCloseModal}>
    <Modal.Header closeButton>
      <Modal.Title className={styles.colorText}>Edit / delete suroviny: </Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <Form.Group> 
        <Form.Control 
          type="text" 
          value={formData.name} 
          onChange={(e) => {
            setField("name", e.target.value);
            setDuplicateError(null); // Resetuje chybovú správu duplicity po zmene názvu
          }}
          required
        /> 
          {duplicateError && (
            <Form.Text className="text-danger"> {duplicateError} </Form.Text>
          )}
      </Form.Group>
    </Modal.Body>
        
    <Modal.Footer>
      <Button 
        variant="primary"
        style={{ marginLeft: "8px" }}
        onClick={handleEditIngredient} 
      >
        Uložit
      </Button>
      <Button 
        variant="outline-danger"
        style={{ marginLeft: "8px" }}
        onClick={() => {
          handleCloseModal();
          setDeleteModalShown(true)}}
      >
        Vymazat
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

  <Modal show={isDeleteModalShown} onHide={() => setDeleteModalShown(false)}>
    <IngredientDelete 
      onClose={() => setDeleteModalShown(false)}
      ingredient={ingredient}
      recipeList={recipeList} 
    />
  </Modal>
</>
);
};