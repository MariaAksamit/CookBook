import React, { useState, useEffect } from "react";
import IngredientList from '../components/ingredient/IngredientList';

function IngredientListR() {
   const [ingredientList, setIngredientList] = useState([]);
   const [recipeList, setRecipeList] = useState([]);
  
   useEffect(() => {
      fetch('http://127.0.0.1:8000/recipe/list')
         .then(response => response.json())
         .then(data => setRecipeList(data))
         .catch(error => console.error('Error fetching data:', error));
    
      fetch('http://127.0.0.1:8000/ingredient/list')
         .then(response => response.json())
         .then(data => setIngredientList(data))
         .catch(error => console.error('Error fetching data:', error));
   }, []); 

return (
   <div>
      <IngredientList 
         ingredientList={ingredientList} 
         setIngredientList={setIngredientList}
         recipeList={recipeList} 
      />
   </div>
);   
};
  
export default IngredientListR;