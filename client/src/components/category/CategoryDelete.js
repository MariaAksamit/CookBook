import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';

export default function CategoryDelete({ category, recipeList, onClose }) {
  const [isDeleteModalShown, setDeleteModalShown] = useState(true);
  
  const isUsed = () => {
    return recipeList.some(recipe => recipe.category === category.name);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch("/category/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: category.id }),
      });

      if (response.ok) {
        console.log("Category deleted successfully");
      } else {
        const errorData = await response.json();
        console.error("Error deleting category:", errorData);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setDeleteModalShown(false);
      onClose();
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDelete();
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setDeleteModalShown(false);
      onClose();
      window.location.reload();
    }
  };

return (
<>
  <Modal.Header closeButton>
    <Modal.Title>Potvrdit vymazání</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {isUsed() ? (
      <p>Nemůžete vymazat kategorii, která obsahuje recepty.</p>
        ) : (
      <p>Opravdu chcete vymazat tuto kategorii?</p>
    )}
  </Modal.Body>

  <Modal.Footer>
    {!isUsed() && (
      <Button variant="danger" onClick={handleConfirmDelete}>
        Áno, vymazat
      </Button>
    )}
    <Button variant="secondary" onClick={onClose}>
      Zrušit
    </Button>
  </Modal.Footer>
</>
);
}