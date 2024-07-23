import React from "react";
import Recipes from "./Recipes";

function RecipeGridList({ recipeList, ingredientList, categoryList }) {
  return (
    <div className="row">
    {recipeList.map((recipe) => {
    return (
      <div
        className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3"
        style={{ paddingBottom: "16px"}}
      >
        <Recipes 
          recipe={recipe}
          ingredientList={ingredientList} 
          categoryList={categoryList}
        />
       </div>
      );
    })}
    </div>
  );
}

export default RecipeGridList;