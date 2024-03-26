const fs = require("fs");
const path = require("path");
const RecipeDao = require("../../dao/recipe-dao");
let dao = new RecipeDao(
  path.join(__dirname, "..", "..", "storage", "recipes.json")
);

async function ListAbl(req, res) {
  try {
    // Přečte obsah souboru recipes.json
    const recipesData = fs.readFileSync("./storage/recipes.json", "utf-8");
    const recipes = JSON.parse(recipesData);
    
    // Odešle seznam receptů jako odpověď na požadavek
    res.json(recipes);
  } catch (error) {
    console.error("Chyba při čtení souboru recipes.json:", error);
    res.status(500).send("Internal Server Error");
  }
}


module.exports = ListAbl;
