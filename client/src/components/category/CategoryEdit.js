import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from 'react-bootstrap';

import styles from "../../styles/recipeList.module.css";
import CategoryDelete from "./CategoryDelete";

export default function CategoryEdit ({ category, categoryList, recipeList, handleShowModal }) {
  const [isModalShown, setShow] = useState(false);
  const [categoryEditCall, setCategoryEditCall] = useState({ state: "pending" });
  const [duplicateError, setDuplicateError] = useState(null);
  const [isDeleteModalShown, setDeleteModalShown] = useState(false);
  const [formData, setFormData] = useState({ name: category ? category.name : "" });

  const handleCloseModal = () => {
    setFormData({ name: category ? category.name : "" });
    setShow(false);
    setDuplicateError(null); // Resetuje chybovú správu duplicity pri zatváraní modálneho okna
  }

  const handleOpenModal = () => {
    handleShowModal(category); // Zavoláme handleShowModal z rodičovskej komponenty
    setFormData({ name: category ? category.name : "" });
    setShow(true);
  };

  useEffect(() => {
    // Ak existuje surovina, otvorme modálne okno pri načítaní komponenty
    if (category) {
      handleOpenModal();
    }
  }, [category]);

  const handleDeleteCategory =() => setDeleteModalShown(true);
  
  const handleEditCategory = async(e) => {
    try {

      const form = e.currentTarget;
  
      e.preventDefault();
      e.stopPropagation();

      const isDuplicate = checkForDuplicate(formData.name);

      if (isDuplicate) {
        setDuplicateError("Název kategorie již existuje. Zvolte jiný název.");
      return;
      } 

      // Kontrola počtu znakov v názve kategorie (2-50) a nechcených znakov
      const validCharactersRegex = /^[a-zA-Z0-9\s-,áäéěíýóúůčďňšťžľĺřŕÁÉÍÝÓÚŮČĎŇŠŤŽĽĹŘŔ]+$/; // Povolené sú písmená, číslice, medzery a pomlčky

      // Kontrola počtu znakov v názve kategorie (2-50)
      if (formData.name.length < 2 || formData.name.length > 25 || !validCharactersRegex.test(formData.name)) {
        setDuplicateError("Zadejte název kategorie o délce 2 až 25 povolených znaků (písmena, číslice, mezery a pomlčky).");
      return;
      }
      const updatedCategory = {
        name: formData.name,
        id: category.id,
      };
  
   // Volání API na server pro aktualizaci receptu
   const response = await fetch("/category/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCategory),
    });
  
    if (response.ok) {
      setShow(false);

    } else {
      const errorData = await response.json();
      setCategoryEditCall({ state: "error", error: errorData });
    }

    } catch (error) {
      console.error("Chyba ve funkci handleEditCategory:", error);
      setCategoryEditCall({ state: "error", error: error.message });
    } finally {
      //window.location.reload();
    }
  };
  
  useEffect(() => {
    setFormData({ name: category ? category.name : "" });
  }, [category]);

  const setField = (name, val) => {
    setFormData((formData) => {
      return { ...formData, [name]: val };
    });
  };

  // Funkcia na kontrolu duplicity
  const checkForDuplicate = (name) => {
    const existingCategories = categoryList.map((item) =>
      item.name.toLowerCase()
    );
    return existingCategories.includes(name.toLowerCase());
  };

return (
<>
  <Modal show={isModalShown} onHide={handleCloseModal}>
    <Modal.Header closeButton>
      <Modal.Title className={styles.colorText}>Edit / delete kategorie: </Modal.Title>
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
        onClick={handleEditCategory} 
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
    <CategoryDelete 
      onClose={() => setDeleteModalShown(false)}
      category={category}
      recipeList={recipeList} 
    />
  </Modal>
</>
);
};