import React, { useState, useEffect } from "react";
import RecipeList from '../components/recipe/RecipeList';

function RecipeListR() {
  const [recipeList, setRecipeList] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);

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
         <RecipeList 
         recipeList={recipeList}
         setRecipeList={setRecipeList} 
         ingredientList={ingredientList}
         />
      </div>
   );   
}

export default RecipeListR;