import React, { useState, useEffect } from "react";
import CategoryList from '../components/category/CategoryList';


function CategoryListR() {
   const [categoryList, setCategoryList] = useState([]);
   const [recipeList, setRecipeList] = useState([]);

   useEffect(() => {
      fetch('http://127.0.0.1:8000/category/list')
         .then(response => response.json())
         .then(data => setCategoryList(data))
         .catch(error => console.error('Error fetching category data:', error));

      fetch('http://127.0.0.1:8000/recipe/list')
         .then(response => response.json())
         .then(data => setRecipeList(data))
         .catch(error => console.error('Error fetching data:', error));
   }, []); 

   console.log(categoryList);
   console.log(recipeList);
return (
   <div>
      <CategoryList 
         categoryList={categoryList}
         recipeList={recipeList}
      />        
   </div>
);   
};
  
export default CategoryListR;