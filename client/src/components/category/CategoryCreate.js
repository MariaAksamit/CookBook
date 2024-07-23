import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import styles from "../../styles/recipeList.module.css";

export default function CategoryCreate ({ handleShowModal, categoryList }) {
  const [isModalShown, setShow] = useState(false);
  const [categoryCall, setCategoryCall] = useState({ state: "pending" });
  const [duplicateError, setDuplicateError] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  const handleCloseModal = () => {
    setShow(false);
    setDuplicateError(null); // Resetuje chybovú správu duplicity pri zatváraní modálneho okna
  };

  const handleOpenModal = () => {
    handleShowModal();
    setShow(true);
  }
  
  useEffect(() => {
    if (isModalShown) handleOpenModal();
  }, [isModalShown]);

  const handleCreateCategory = async (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
    
      // Skontroluje duplicity
      const isDuplicate = checkForDuplicate(categoryName);

      if (isDuplicate) {
        setDuplicateError("Název kategorie již existuje. Zvolte jiný název.");
      return;
      } 
      
      // Kontrola počtu znakov v názve kategorie (2-50) a nechcených znakov
      const validCharactersRegex = /^[a-zA-Z0-9\s-,áäéěíýóúůčďňšťžľĺřŕÁÉÍÝÓÚŮČĎŇŠŤŽĽĹŘŔ]+$/; // Povolené sú písmená, číslice, medzery a pomlčky

      // Kontrola počtu znakov v názve kategorie (2-50)
      if (categoryName.length < 2 || categoryName.length > 25 || !validCharactersRegex.test(categoryName)) {
        setDuplicateError("Zadejte název kategorie o délce 2 až 25 povolených znaků (písmena, číslice, mezery a pomlčky).");
      return;
      }

      const newCategory = {
        name: categoryName,
      };
    
      const response = await fetch("/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });
    
      if (response.ok) {
        setShow(false);
      } else {
        const errorData = await response.json();
        setCategoryCall({ state: "error", error: errorData });
      }
      } catch (error) {
        setCategoryCall({ state: "error", error: error.message });
      } finally {
        //window.location.reload();
      }
  };
  
  // Funkcia na kontrolu duplicity
  const checkForDuplicate = (name) => {
    const existingCategory = categoryList.map((item) =>
      item.name.toLowerCase()
    );
    return existingCategory.includes(name.toLowerCase());
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
      <Modal.Title className={styles.colorText}> Vytvoření nové kategorie: </Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <Form.Group> 
        <Form.Control 
          type="text" 
          placeholder="Nová kategorie"
          value={categoryName}
          onChange={(e) => {
            setCategoryName(e.target.value);
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
        onClick={handleCreateCategory} 
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