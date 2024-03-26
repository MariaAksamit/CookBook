const fs = require("fs");
const path = require("path");
const Ajv = require("ajv").default;
const IngredientDao = require("../../dao/ingredient-dao");
let dao = new IngredientDao(
  path.join(__dirname, "..", "..", "storage", "ingredients.json")
);

let schema = {
  type: "object",
  properties: {},
  required: [],
};

async function ListAbl(req, res) {
  try {
    const ingredientsData = fs.readFileSync("./storage/ingredients.json", "utf-8");
    const ingredients = JSON.parse(ingredientsData);
    
    res.json(ingredients);
  } catch (error) {
    console.error("Chyba při čtení souboru ingredients.json:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = ListAbl;
