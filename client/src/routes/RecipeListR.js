import React, { useState, useEffect } from "react";
import RecipeList from '../components/recipe/RecipeList';
import { useCategory } from '../routes/SelectedCategoryContext';

function RecipeListR() {
   const [recipeList, setRecipeList] = useState([]);
   const [ingredientList, setIngredientList] = useState([]);
   const [categoryList, setCategoryList] = useState([]);
   const { selectedCategory } = useCategory();
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      Promise.all([
         fetch('http://127.0.0.1:8000/recipe/list').then(response => response.json()),
         fetch('http://127.0.0.1:8000/ingredient/list').then(response => response.json()),
         fetch('http://127.0.0.1:8000/category/list').then(response => response.json())
      ])
      .then(([recipeData, ingredientData, categoryData]) => {
         setRecipeList(recipeData);
         setIngredientList(ingredientData);
         setCategoryList(categoryData);
      })
      .catch(error => {
         console.error('Error fetching data:', error);
         setError('Error fetching data. Please try again.');
      })
      .finally(() => {
         setLoading(false);
      });
   }, []); 

   if (loading) {
      return <div>Loading...</div>;
   }

   if (error) {
      return <div>Error: {error}</div>;
   }

   return (
      <div>
         <RecipeList 
            recipeList={recipeList}
            setRecipeList={setRecipeList} 
            ingredientList={ingredientList}
            categoryList={categoryList}
            selectedCategory={selectedCategory}
         />
   </div>
);   
};

export default RecipeListR;