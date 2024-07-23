import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';

export default function IngredientDelete({ ingredient, recipeList, onClose }) {
  const [isDeleteModalShown, setDeleteModalShown] = useState(true);

  const isUsed = () => {
    return recipeList.some(recipe => recipe.ingredients.some(ing => ing.id === ingredient.id));
  };

  const handleDelete = async () => {
    try {
      const response = await fetch("/ingredient/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: ingredient.id }),
      });

      if (response.ok) {
        console.log("Ingredient deleted successfully");
      } else {
        const errorData = await response.json();
        console.error("Error deleting ingredient:", errorData);
      }
    } catch (error) {
      console.error("Error deleting ingredient:", error);
    } finally {
      setDeleteModalShown(false);
      onClose();
      window.location.reload();
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDelete();
    } catch (error) {
      console.error("Error deleting ingredient:", error);
    } finally {
      setDeleteModalShown(false);
      onClose();
    }
  };

return (
<>
  <Modal.Header closeButton>
    <Modal.Title>Potvrdit vymazání</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {isUsed() ? (
      <p>Nemůžete vymazat surovinu, která je použita v receptu.</p>
        ) : (
      <p>Opravdu chcete vymazat tuto surovinu?</p>
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