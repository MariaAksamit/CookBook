import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';

export default function RecipeDelete({ recipe, onClose }) {
  const [isDeleteModalShown, setDeleteModalShown] = useState(true);

  const handleDelete = async () => {
    try {
      // Handle the deletion logic here
      console.log("Deleting recipe:", recipe);
      // Volanie API na server pre vymazanie suroviny
      const response = await fetch("/recipe/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: recipe.id }),
      });

      if (response.ok) {
        console.log("Recipe deleted successfully");
      } else {
        const errorData = await response.json();
        console.error("Error deleting recipe:", errorData);
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    } finally {
      // Close the delete confirmation modal
      setDeleteModalShown(false);
      onClose();
      window.location.reload();
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDelete();
    } catch (error) {
      console.error("Error deleting recipe:", error);
    } finally {
      // Close the delete confirmation modal
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
        Opravdu chcete vymazat tento recept?
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={handleConfirmDelete}>
          Ano, vymazat
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Zrušit
        </Button>
      </Modal.Footer>
    </>
  );
}