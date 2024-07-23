const fs = require("fs");
const path = require("path");
const CategoryDao = require("../../dao/category-dao");

let dao = new CategoryDao(path.join(__dirname, "..", "..", "storage", "recipeCategories.json"));

async function ListAbl(req, res) {
  try {
    const categoriesData = fs.readFileSync(path.join(__dirname, "..", "..", "storage", "recipeCategories.json"), "utf-8");
    const categories = JSON.parse(categoriesData);
    
    res.json(categories);
  } catch (error) {
    console.error("Chyba při čtení souboru recipeCategories.json:", error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = ListAbl;